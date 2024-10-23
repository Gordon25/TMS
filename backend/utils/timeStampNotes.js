export default (username, state, notes) => {
  let stampedNotes = "";
  if (notes !== "") {
    const now = new Date();
    const dateTime = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    stampedNotes = `********************\n[${username}, ${state}, ${dateTime}]\n\n${notes}\n`;
  }
  return stampedNotes;
};
