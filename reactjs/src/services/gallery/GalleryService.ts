import http from '../httpService';

class GalleryService {
  public async getAllByEntity(teamId: Number, eventId: Number, playerId: Number, matchId: Number , groundID: Number) {
    let url = `/api/services/app/PictureGallery/GetAllByEnityId`;
    if (teamId) url += `?teamId=${teamId}`
    if (eventId) url += `?eventId=${eventId}`
    if (playerId) url += `?playerId=${playerId}`
    if (matchId) url += `?matchId=${matchId}`
    if (groundID) url += `?groundID=${groundID}`

    let result = await http.get(url);
    return result.data;
  }
}

export default new GalleryService();
