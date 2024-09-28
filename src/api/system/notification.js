import Resource from '../../api/resource';
import request from "../../utils/request";

class Notification extends Resource {
    constructor() {
        super('notifications');
    }


}

export {Notification as default};
