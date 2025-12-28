export namespace main {
	
	export class AppSetting {
	    language: string;
	    theme_mode: string;
	    custom_font: string;
	    max_history_count: number;
	    data_dir: string;
	
	    static createFrom(source: any = {}) {
	        return new AppSetting(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.language = source["language"];
	        this.theme_mode = source["theme_mode"];
	        this.custom_font = source["custom_font"];
	        this.max_history_count = source["max_history_count"];
	        this.data_dir = source["data_dir"];
	    }
	}
	export class ConnectConfig {
	    name: string;
	    address: string;
	    http_schema: string;
	    ca_certificate: string;
	    client_certificate: string;
	    client_key: string;
	    ignore_certificate_verification: boolean;
	    username: string;
	    password: string;
	
	    static createFrom(source: any = {}) {
	        return new ConnectConfig(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.address = source["address"];
	        this.http_schema = source["http_schema"];
	        this.ca_certificate = source["ca_certificate"];
	        this.client_certificate = source["client_certificate"];
	        this.client_key = source["client_key"];
	        this.ignore_certificate_verification = source["ignore_certificate_verification"];
	        this.username = source["username"];
	        this.password = source["password"];
	    }
	}

}

