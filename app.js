const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const providerRoutes = require('./routes/providerRoutes');
const providerWorkRoutes = require('./routes/providerWorkRoutes');
const companyOwnerRoutes = require('./routes/companyOwnerRoutes');
const milestoneRoutes = require('./routes/milestoneRoutes');
const clientRoutes = require('./routes/clientRoutes');
const forYouRoutes = require('./routes/recommendationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const chatRoutes = require('./routes/chatRoutes');
const locationRoutes = require('./routes/locationRoutes');
const providerSearchRoites = require('./routes/providerSearchRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/provider/work', providerWorkRoutes);
app.use('/api/owner', companyOwnerRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/client', forYouRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/search', providerSearchRoites);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});