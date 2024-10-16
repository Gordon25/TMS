export default (username, state, notes) => {
  let stampedNotes = "";
  if (notes != "") {
    const now = new Date();
    const dateTime = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    const stampedNotes = `[${username}, ${state}, ${dateTime}]\n${notes}`;
  }
  return stampedNotes;
};
