import client from './client'

export default {
  checkoutWorkingFile (workingFileId, taskId, personId, callback) {
    const checkoutData = {
      working_file_id: workingFileId,
      task_id: taskId,
      person_id: personId
    }
    client.post(
      `/api/actions/working-files/${workingFileId}/checkout`,
      checkoutData,
      callback
    )
  },

  deleteWorkingFile (workingFileId) {
    console.log('/api/data/working-files/' + workingFileId)
    client.del(`/api/data/working-files/${workingFileId}`)
  }
}
