import { exec } from 'child_process';

const addInterfaceToZone = async(zone, networkDevice) => {
    const command = `firewall-cmd --zone=${zone} --add-interface=${networkDevice}`;
  
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
}

const getIPLink = async(callback) => {
    let resp = exec('ip link', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error.message}`);
        callback(error, null);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        callback(stderr, null);
        return;
      }
  
      const adapterNames = stdout.split('\n')
        .map(line => line.trim().match(/^\d+: (\w+):/))
        .filter(Boolean)
        .map(match => match[1]);
  
      callback(null, adapterNames);
    });
    return resp;
}

const getFirewallRules = async () => {
    let resp = exec('firewall-cmd --list-all', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      return stdout;
      
    });
}

function parseFirewallRules(output) {
    const result = {};
    const lines = output.split('\n');
    
    for (const line of lines) {
      const match = line.match(/(\w+[-\w]*):\s*(.+)/);
      if (match) {
        result[match[1]] = match[2];
      }
    }
  
    return result;
}

function extractNetworkDeviceNames(inputDevices) {

    if (typeof inputDevices !== 'string') {
        throw new TypeError('Expected a string as input');
    }

    const deviceNames = [];
    const lines = inputDevices.split('\n');
    
    for (const line of lines) {
      const match = line.match(/^\d+: (\w+):/);
      if (match) {
        deviceNames.push(match[1]);
      }
    }
  
    return deviceNames;
}
  
export {
    addInterfaceToZone,
    parseFirewallRules,
    getIPLink,
    getFirewallRules
};