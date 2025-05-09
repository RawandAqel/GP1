const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const providerRoutes = require('./routes/providerRoutes');
const providerWorkRoutes = require('./routes/providerWorkRoutes');
const companyOwnerRoutes = require('./routes/companyOwnerRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/provider/work', providerWorkRoutes);
app.use('/api/owner', companyOwnerRoutes);
app.use('/api/milestones', milestoneRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});