const mongoose = require('mongoose');

async function test() {
  try {
    const uri = 'mongodb+srv://himanshiwork4_db_user:Arshii%402@cluster0.ovmbbpz.mongodb.net/student-dashboard?appName=Cluster0';
    console.log("Connecting...");
    await mongoose.connect(uri);
    console.log("Connected.");
    const User = mongoose.model('User', new mongoose.Schema({ name: String }));
    console.log("Finding user...");
    await User.findOne({});
    console.log("Found");
  } catch (e) {
    console.error("DB Error:", e.message);
  } finally {
    process.exit(0);
  }
}
test();
