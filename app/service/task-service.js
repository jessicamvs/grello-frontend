'use strict'

let testResponse = {}
testResponse.data = [
  {
    _id: 1,
    name: 'task1',
    priority: 1,
    category: {
      _id: '000',
      name: 'uncategorized',
      priority: 1
    },
    document: {
      _id: 1,
      name: 'document1'
    },
    user: '123'
  },{
    _id: 2,
    name: 'task2',
    priority: 2,
    category: {
      _id: '000',
      name: 'uncategorized',
      priority: 1
    },
    document: {
      _id: 1,
      name: 'document1'
    },
    user: '123'
  },{
    _id: 3,
    name: 'task3',
    priority: 3,
    category: {
      _id: '001',
      name: 'P0',
      priority: 2
    },
    document: {
      _id: 1,
      name: 'document1'
    },
    user: '123'
  }
]

module.exports = ['$q', '$log', '$http', 'authService', taskService]

function taskService($q, $log, $http, authService) {
  $log.debug('taskService()')

  let service = {}

  service.task = []
  //
  // service.createTask = function(task) {
  //   $log.debug('taskService.createTask()')
  //
  //   return authService.getToken()
  //   .then( token => {
  //     let url = `${__API_URL__}/api/task`
  //     let config = {
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     }
  //
  //     return $http.post(url, task, config)
  //   })
  //   .then( res => {
  //     $log.log('task created')
  //     let task = res.data
  //     service.task.unshift(task)
  //     return task
  //   })
  //   .catch( err => {
  //     $log.error(err.message)
  //     return $q.reject(err)
  //   })
  // }


  service.fetchTasks = function() {
    $log.debug('taskService.createTasks()')

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/task`
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
      return $q.resolve(testResponse)
      // return $http.get(url, config)
    })
    .then( res => {
      $log.log('task retrieved')
      service.task = res.data
      return service.task
    })
    .catch( err => {
      $log.error(err.message)
      return $q.reject(err)
    })
  }

  service.updateTask = function(taskID, taskData) {
    $log.debug('taskService.updateTask()')
    $log.debug(typeof taskID)

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/task/${taskID}`
      let config = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

      return $http.put(url, taskData, config)
    })
    .then( res => {
      for (let i = 0; i < service.task.length; i++) {
        let current = service.task[i]
        if (current._id === taskID) {
          service.task[i] = res.data
          break
        }
      }

      return res.data
    })
    .catch( err => {
      $log.error(err.message)
      return $q.reject(err)
    })
  }

  service.resolveTask = function(taskID) {
    $log.debug('taskService.updateTask()')

    return authService.getToken()
    .then( token => {
      let url = `${__API_URL__}/api/task/${taskID}`
      let config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }

      return $http.put(url, config)
    })
    .then( res => {
      for (let i = 0; i < service.task.length; i++) {
        let current = service.task[i]
        if (current._id === taskID) {
          service.task.splice(i, 1)
          break
        }
      }
    })
    .catch( err => {
      $log.error(err.message)
      return $q.reject(err)
    })
  }

  return service
}