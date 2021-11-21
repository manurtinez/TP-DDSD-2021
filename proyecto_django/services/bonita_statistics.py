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
