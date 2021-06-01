const fs = require('fs');
const axios = require('axios');

const capitalize = (s) => s && s[0].toUpperCase() + s.slice(1);

class Service {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.up = true;
    this.endpoints = {};
  };
  addEndpoint(url, httpMethod) {
    if (typeof this.endpoints[httpMethod] === 'undefined') {
      this.endpoints[httpMethod] = new Set();
    }
    this.endpoints[httpMethod].add(url);
  };
  checkEndpoint(url, httpMethod) {
    if (typeof this.endpoints[httpMethod] === 'undefined') {
      return false;
    } else {
      return this.endpoints[httpMethod].has(url);
    }
  };
  dumpServiceInfo() {
    console.log("Service URL is:", this.baseUrl);
    console.log("is Up?:", this.up);
    console.log("Registered endpoints:");
    for (const key in this.endpoints) {
      console.log(key.toUpperCase(), 'endpoints:');
      for (let item of this.endpoints[key]) {
        console.log(" ", item);
      }
    }
  }
}

class ServiceManager {
  constructor() {
    this.doc = JSON.parse(fs.readFileSync('./swagger.json'));
    this.services = {};
  };

  async addService(serviceName, serviceSpecURL) {
    console.log("Adding service...");
    try {
      if (!this.serviceIsUp(serviceName)) {
        this.services[serviceName] = new Service(
          // 10 is used cause that's how long '/spec-json' is
          serviceSpecURL.slice(0, serviceSpecURL.length - 10)
        );
        const response = await axios.get(serviceSpecURL);
        const serviceEndpoints = response.data.paths;
        const UpperCaseServiceName = capitalize(serviceName)
        for (const [path, details] of Object.entries(serviceEndpoints)) {
          for (let method in details) {
            details[method].tags = [UpperCaseServiceName];
            this.services[serviceName].addEndpoint(path, method);
          }
          this.doc.paths['/' + serviceName + path] = details;
        }
        this.services[serviceName].up = true;
        console.log(`Service ${UpperCaseServiceName} added`);
        console.log(`=======${UpperCaseServiceName}=======`);
        this.services[serviceName].dumpServiceInfo();
        console.log(`=======${UpperCaseServiceName}=======`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  serviceIsUp(serviceName) {
    if (typeof this.services[serviceName] === 'undefined') {
      return false;
    } else if (this.services[serviceName].up == false) {
      delete this.services[serviceName];
      return false;
    } else {
      return true;
    }
  }

  getRealEndpoint(serviceName, fullUrl) {
    let slicedUrl = fullUrl.slice(serviceName.length + 1);
    if (slicedUrl.length == 0) return '/';
    else return slicedUrl;
  }

  checkServiceEndpoint(serviceName, fullUrl, httpMethod) {
    if (!this.serviceIsUp(serviceName)) {
      return false;
    }
    const slicedUrl = this.getRealEndpoint(serviceName, fullUrl);
    return this.services[serviceName]
      .checkEndpoint(slicedUrl, httpMethod);
  };

  removeService(serviceName) {
    const checkString = '/' + serviceName;
    for (let path in this.doc.paths) {
      if (path.startsWith(checkString)) {
        delete this.doc.paths[path];
      }
    }
    delete this.services[serviceName];
  };

  getTargetUrl(serviceName, fullUrl, queryParams) {
    const baseUrl = this.services[serviceName].baseUrl;
    const realEndpoint = this.getRealEndpoint(serviceName, fullUrl);
    return queryParams ?
           baseUrl + realEndpoint + '?' + queryParams:
           baseUrl + realEndpoint;
  }

  /** Assumes service and endpoint are up */
  doGet(serviceName, fullUrl, queryParams, headers) {
    const targetUrl = this.getTargetUrl(serviceName, fullUrl, queryParams);
    console.log('FORWARD GET', targetUrl);
    return axios.get(targetUrl, { headers: headers });
  }
  
  /** Assumes service and endpoint are up */
  doPost(serviceName, fullUrl, queryParams, headers, body) {
    const targetUrl = this.getTargetUrl(serviceName, fullUrl, queryParams);
    console.log('FORWARD POST', targetUrl);
    return axios.post(
      targetUrl, body, { headers: headers }
    );
  }

};


module.exports = new ServiceManager();
