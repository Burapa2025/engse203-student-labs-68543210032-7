const student = {
  name: "นายบูรพา ประทีปรัตน์",
  studentId: "68543210032-7",
  os: process.platform,
  node: process.version,
};

function createGreeting({ name, studentId, os, node }) {
  return `Hello ${name} (${studentId}) | OS: ${os} | Node: ${node}`;
}

console.log(createGreeting(student));