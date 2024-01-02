import express from 'express';
import * as extras from './inc/misc.js';
const port = 8080;

const app = express();

// Serve static files from 'public' directory
app.use(express.static('public'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));


// Create a route to list all firewall rules
app.get('/api/get-rules', async (req, res) => {
let rules = extras.getFirewallRules()
    res.send(extras.parseFirewallRules(rules));
});

// Create a route to add a new firewall rule
app.post('/api/add-rule', async (req, res) => {
  const { protocol, port, source, destination } = req.body;
  try {
    await firewallManager.addRule({
      protocol,
      port,
      source,
      destination
    });
    res.status(200).send('Firewall rule added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding firewall rule');
  }
});

// Create a route to delete a firewall rule
app.delete('/api/delete-rule/:id', async (req, res) => {
  const ruleId = req.params.id;
  try {
    await firewallManager.deleteRule(ruleId);
    res.status(200).send('Firewall rule deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting firewall rule');
  }
});

app.get('/api/NetworkAdapters', async (req,res) => {

    console.log('Network Adapter Request...');

    extras.getIPLink((err, names) => {
        if (err) {
          console.error(err);
          res.status(200).send(`{"result": ${err}`);
        } else {
          console.log('Network Adapters:', names);
          res.status(200).send(`{"result": ${names}`);
        }
      });
    
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
