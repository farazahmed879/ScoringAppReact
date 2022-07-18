import AppConsts from '../lib/appconst';
const baseUrl = 'http://localhost:21021';


export function getImage(image: any) {
    if (image == null || image == undefined) {
        return AppConsts.dummyImage;
      }
      return baseUrl + '/' + image;
  }
  export default getImage;
  