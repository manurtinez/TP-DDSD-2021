import requests

from .bonita_service import bonita_api_call


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
    for task in completed_tasks:
        result = bonita_api_call(session, '/bpm/caseVariable', 'get',
                                 '/{case_id}/{var}'.format(case_id=task['caseId'], var=var_name))['value']
        if result == 'true':
            result_dict['aprobados'] += 1
        else:
            result_dict['rechazados'] += 1
    return result_dict


def get_open_cases(session):
    """
    Este metodo devuelve cuantos casos hay en proceso ("started") y cuantos hay finalizados.
    """
    # Obtener proceso de bonita para usar el ID
    bonita_process = bonita_api_call(
        session, '/bpm/process', 'get', '?s=Proceso')[0]

    # Traer casos activos
    open_case_list = bonita_api_call(
        session, '/bpm/case', 'get', '?f=processDefinitionId={}'.format(bonita_process['id']))

    # Traer casos activos
    archived_case_list = bonita_api_call(
        session, '/bpm/archivedCase', 'get', '?f=processDefinitionId={}'.format(bonita_process['id']))
    if bonita_process and open_case_list and archived_case_list:
        return {"activos": len(open_case_list), "finalizados": len(archived_case_list)}
    else:
        return None


def max_stats_user(session, condition):
    """
    Este metodo devuelve el usuario con mas cantidad de aprobados / rechazos segun lo que se reciba en "condition".

    Params:
        * condition (str): "aprobaciones" | "rechazos"
    """
    # Traer tareas completadas tanto de mesa como legales
    mesa_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', '?f=state=completed&f=name=Revisión de información')
    legales_tasks = bonita_api_call(
        session, '/bpm/archivedTask', 'get', '?f=state=completed&f=name=Evaluación del estatuto')

    # Juntar las 2 listas en una sola
    merged_list = mesa_tasks + legales_tasks

    count_dict = {}
    for task in merged_list:
        if task['name'].startswith('Rev'):
            # Es de mesa
            var_name = 'aprobado_por_mesa'
        else:
            var_name = 'estatuto_aprobado'

        # Traigo variable de caso
        case_var = bonita_api_call(session, '/bpm/caseVariable', 'get',
                                   '/{case_id}/{var}'.format(case_id=task['caseId'], var=var_name))['value']

        if (condition == 'aprobaciones' and case_var == 'true') or (condition == 'rechazos' and case_var == 'false'):
            user_id = task['executedBy']
            # Sumo contador del id de usuario que ejecuto dicha tarea
            if user_id not in count_dict:
                count_dict[user_id] = 1
            else:
                count_dict[user_id] += 1

    # Extraer el id cuyo contador fue el maximo
    max_id = max(count_dict, key=count_dict.get)

    # Hacer un request para buscar informacion referente a este ID
    user_response = bonita_api_call(session,
                                    '/identity/user', 'get', '?f=enabled=true')
    user_data = [
        us for us in user_response if us['id'] == max_id][0]

    # Adicionalmente, traer el rol del miembro
    role = bonita_api_call(
        session, '/identity/membership', 'get', f'?f=user_id={max_id}&d=role_id')[0]['role_id']['name']

    # Armar dict de respuesta y devolverlo
    return {'id': max_id, 'nombre': user_data['firstname'], 'apellido': user_data['lastname'], 'rol': role}
