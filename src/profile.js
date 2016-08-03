/**
 * profile 配置文件预处理
 *
 * @author:   波比(｡･∀･)ﾉﾞ
 * @date:     2016-08-03  下午2:22
 */

import EventEmitter from 'events';
import fs from 'fs';

class Profile extends EventEmitter {
	constructor (pwd){
		this.pwd = pwd;
	}

	init(){
		let pwd = this.pwd;
		let stream = fs.readFileSync(pwd);
		
	}
}


export default Profile;