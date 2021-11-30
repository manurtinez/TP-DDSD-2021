from datetime import datetime

from .bonita_service import bonita_api_call, get_archived_cases, get_open_cases


def area_statistics(session, area):
    """
    Este metodo procesa las estadisticas correspondientes a mesa de entradas, es decir, cantidad de aprobados y rechazados,
    y devuelve un diccionario con la cantidad de c/u

    Params:
        * session (django session): el objeto session del request
        * area (str, 'mesa' | 'legales'): un string que determina de cual area se desean las estadisticas
    """
    result_dict = {'aprobados': 0, 'rechazados': 0}
    if area == 'mesa':
        task_name = 'Revisión de información'
        var_name = 'aprobado_por_mesa'
    else:
        task_name = 'Evaluación del estatuto'
        var_name = 'estatuto_aprobado'

    completed_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', f'?f=state=completed&f=name={task_name}')

    # Traer tareas de envio de recordatorio, ya que los casos de estas deben omitirse
    recordatorio_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', '?f=state=completed&f=name=Envio mail recordatorio')
    # Me quedo con los ids de los casos de estas
    recordatorio_tasks = [task['caseId'] for task in recordatorio_tasks]

    # Traer casos que PUDIERON haber pasado por email de recordatorio, para omitirlas de los resultados
    all_archived_cases = get_archived_cases(session)
    # Me quedo solo con los ids de los casos que terminaron debido a falta de correccion de datos
    all_archived_cases = [case['rootCaseId'] for case in all_archived_cases]

    for task in completed_tasks:
        # Si la tarea termino por el camino de recordatorio, podemos asumir que fue rechazada por parte de mesa entradas,
        # y nunca siquiera llego a la aprobacion del estatuto
        if task['caseId'] in recordatorio_tasks and task['caseId'] in all_archived_cases:
            result_dict['rechazados'] += 1
        elif task['caseId'] in all_archived_cases:
            # !! TODO aca deberian agarrarse las estadisticas guardadas en la DB, porque los archivados es imposible saber
            pass
        else:   # Si entra aca, es que no estaba archivada. Se trae la variable.
            result = bonita_api_call(session, '/bpm/caseVariable', 'get',
                                     '/{case_id}/{var}'.format(case_id=task['caseId'], var=var_name))['value']
            if result == 'true':
                result_dict['aprobados'] += 1
            else:
                result_dict['rechazados'] += 1
    return result_dict


def open_cases_statistics(session):
    """
    Este metodo devuelve cuantos casos hay en proceso ("started") y cuantos hay finalizados.
    """

    # Traer casos activos
    open_case_list = get_open_cases(session)
    # Traer casos activos
    archived_case_list = get_archived_cases(session)

    return {"activos": len(open_case_list), "finalizados": len(archived_case_list)}


def process_user_count(session, merged_list, all_archived_cases, condition):
    """
    Este metodo hace el procesamiento necesario para contabilizar aceptaciones / rechazos dado una lista de casos.
    """
    count_dict = {}
    for task in merged_list:
        user_id = task['executedBy']
        # Si la tarea es de un caso archivado, SIEMPRE seran verdadero que fue aceptada en ambos lados
        if task['caseId'] in all_archived_cases:
            # Sumo contador del id de usuario que ejecuto dicha tarea
            if user_id not in count_dict:
                count_dict[user_id] = 1
            else:
                count_dict[user_id] += 1
        else:
            if task['name'].startswith('Rev'):
                # Es de mesa
                var_name = 'aprobado_por_mesa'
            else:
                var_name = 'estatuto_aprobado'

            # Traigo variable de caso
            case_var = bonita_api_call(session, '/bpm/caseVariable', 'get',
                                       '/{case_id}/{var}'.format(case_id=task['caseId'], var=var_name))['value']

            # Chequeo que se cumpla la condicion adecuada
            if (condition == 'aprobaciones' and case_var == 'true') or (condition == 'rechazos' and case_var == 'false'):
                # Sumo contador del id de usuario que ejecuto dicha tarea
                if user_id not in count_dict:
                    count_dict[user_id] = 1
                else:
                    count_dict[user_id] += 1
    return count_dict


def max_stats_user(session, condition):
    """
    Este metodo devuelve los 5 (puede cambiar) usuarios con mas cantidad de aprobados / rechazos,
    segun lo que se reciba en "condition".

    Params:
        * condition (str): "aprobaciones" | "rechazos"
    """
    # Traer tareas completadas tanto de mesa como legales
    mesa_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', '?f=state=completed&f=name=Revisión de información')
    legales_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', '?f=state=completed&f=name=Evaluación del estatuto')

    # Traer tareas de envio de recordatorio, ya que los casos de estas deben omitirse
    recordatorio_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', '?f=state=completed&f=name=Envio mail recordatorio')
    # Me quedo con los ids de los casos de estas
    recordatorio_tasks = [task['caseId'] for task in recordatorio_tasks]

    # Traer casos que PUDIERON haber pasado por email de recordatorio, para omitirlas de los resultados
    all_archived_cases = get_archived_cases(session)
    # Me quedo solo con los ids de los casos que terminaron debido a falta de correccion de datos
    all_archived_cases = [case['rootCaseId'] for case in all_archived_cases]

    # Juntar las 2 listas (mesa y legales) en una sola
    merged_list = mesa_tasks + legales_tasks

    # OMITO todas las tasks que pertenezcan a casos que pasaron por el recordatorio
    merged_list = [task for task in merged_list if task['caseId']
                   not in recordatorio_tasks]

    count_dict = process_user_count(
        session, merged_list, all_archived_cases, condition)

    # Extraer el id cuyo contador fue el maximo
    # max_id = max(count_dict, key=count_dict.get)

    # Top n (5) ocurrencias
    sorted_list = sorted(count_dict.items(),
                         key=lambda x: x[1], reverse=True)[:5]

    # sorted_list = list(map(lambda x: x[0], sorted_list))

    results = []
    for id, count in sorted_list:
        # Hacer un request para buscar informacion referente a cada uno de los IDS del top
        user_response = bonita_api_call(session,
                                        '/identity/user', 'get', '?f=enabled=true')
        user_data = [
            us for us in user_response if us['id'] == id][0]

        # Adicionalmente, traer el rol del miembro
        role = bonita_api_call(
            session, '/identity/membership', 'get', f'?f=user_id={id}&d=role_id')[0]['role_id']['name']

        # Armar dict de respuesta
        results.append(
            {'id': id, 'nombre': user_data['firstname'], 'apellido': user_data['lastname'], 'rol': role, 'cantidad': count})
    return results


def average_case_resolution(session):
    """
    Este metodo calcula el tiempo promedio de resolucion de procesos, teniendo en cuenta todos los que estan terminados.
    """
    # Traer casos completados
    completed_cases = get_archived_cases(session)

    # Si no se encontraron casos, devolver 0
    if len(completed_cases) == 0:
        return 0

    total_time = 0

    for case in completed_cases:
        start_date = datetime.strptime(case['start'].split('.')[
                                       0], '%Y-%m-%d %H:%M:%S')
        end_date = datetime.strptime(case['end_date'].split('.')[
                                     0], '%Y-%m-%d %H:%M:%S')

        total_time += (end_date - start_date).seconds

    average = total_time / len(completed_cases)
    return average
