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
        for (const [path, details] of Object.entries(serviceEndpoints)) {
          const UpperCaseServiceName = capitalize(serviceName)
          for (let method in details) {
            details[method].tags = [UpperCaseServiceName];
            this.services[serviceName].addEndpoint(path, method);
          }
          this.doc.paths['/' + serviceName + path] = details;
        }
        this.services[serviceName].up = true;
        console.log(`Service ${UpperCaseServiceName} added`);
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

  checkServiceEndpoint(serviceName, url, httpMethod) {
    if (typeof this.services[serviceName] === 'undefined') {
      return false;
    }
    let slicedUrl = url.slice(serviceName.length + 1)
    if (slicedUrl.length == 0) {
      slicedUrl = '/';
    }
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

};


module.exports = new ServiceManager();