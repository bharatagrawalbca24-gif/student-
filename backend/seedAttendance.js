const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Attendance = require('./models/Attendance');

const mockAttendance = [
    { subject: 'Computer Networks', totalClasses: 40, attendedClasses: 28 },
    { subject: 'Operating Systems', totalClasses: 35, attendedClasses: 30 },
    { subject: 'Database Systems', totalClasses: 38, attendedClasses: 29 },
    { subject: 'Software Engineering', totalClasses: 32, attendedClasses: 30 }
];

const seedAttendance = async () => {
    try {
        await mongoose.connect('mongodb+srv://himanshiwork4_db_user:Arshii%402@cluster0.ovmbbpz.mongodb.net/student-dashboard?appName=Cluster0');
        await Attendance.deleteMany({});
        await Attendance.insertMany(mockAttendance);
        console.log('Attendance seeded');
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seedAttendance();
