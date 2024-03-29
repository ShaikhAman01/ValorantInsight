import Express from "express";
import BodyParser from "body-parser";
import axios from "axios";

const app = Express();
const port= 5000;


app.use(Express.static("public"));
app.set('view engine', 'ejs');

app.use(Express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
try {
    const response = await axios.get('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
    let agentsData = response.data.data;

    if (!agentsData) {
      console.error('Invalid data structure in the API response');
      res.status(500).send('this this Internal Server Error');
      return;
    }
    
    let agents=agentsData.sort((a,b)=> a.displayName.localeCompare(b.displayName));
    // const selectedRole = req.body.role;
    
    
    // // Filter agents based on the selected role
    // const filteredAgents = agentsData.filter(agent => agent.role.displayName === selectedRole);
    
    res.render('index', { data: agents, error: null });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('this that Internal Server Error');
  }
});

app.post('/', async (req, res) => {
  try {
    const response = await axios.get('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
    const agentsData = response.data.data;

    if (!agentsData) {
      console.error('Invalid data structure in the API response');
      return res.status(500).send('Internal Server Error');
    }

    const selectedRole = req.body.role;

    // Filter agents based on the selected role or display all agents if no role selected
    const filteredAgents = selectedRole
      ? agentsData.filter(agent => agent.role.displayName === selectedRole)
      : agentsData;

    if (filteredAgents.length === 0) {
      // No agents found for the selected role
      return res.render('index', { data: null, error: 'No agents found for the selected role' });
    }

    // Sort the filtered agents by display name
    const sortedAgents = filteredAgents.sort((a, b) => a.displayName.localeCompare(b.displayName));

    res.render('index', { data: sortedAgents, error: null });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})


