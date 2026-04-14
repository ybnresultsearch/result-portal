function getResult(){
  const roll = document.getElementById("roll").value;

  if(!roll){
    alert("Please enter roll number");
    return;
  }

  // redirect to result page
  window.location.href = `view.html?roll=${roll}`;
}