const cafeList = document.querySelector("#cafe-list");
const form = document.querySelector("#add-cafe-form");

// create element and render cafes
const renderCafe = doc => {
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(cross);
  li.appendChild(name);
  li.appendChild(city);

  cafeList.appendChild(li);

  // deleting data
  cross.addEventListener("click", e => {
    // stop bubbling up
    e.stopPropagation();

    // get parentEle id
    let id = e.target.parentElement.getAttribute("data-id");

    // get a single item
    db.collection("cafes")
      .doc(id)

      // delete an item in the db
      .delete();
  });
};

// ordering data with .orderBy();
// caps come first
// db.collection("cafes")
//   // get only city New York, and also order them alphabetically by name
//   .where("city", "==", "New York")
//   .orderBy("name")
//   .get()
//   .then(items => {
//     items.docs.forEach(item => {
//       renderCafe(item);
//     });
//   })
//   .catch(err => console.log(err));

// filter the query (where)
// db.collection("cafes")
//   // 1st arg: key, 2nd arg: selector, 3rd arg: value
//   .where("city", "==", "Brooklyn")
//   .get()
//   .then(items => {
//     items.docs.forEach(item => {
//       renderCafe(item);
//     });
//   })
//   .catch(err => console.log(err));

// how to get data from firebase
// db.collection("cafes")
//   .get()
//   .then(snapshot => {
//     snapshot.docs.forEach(doc => {
//       renderCafe(doc);
//     });
//   })
//   .catch(err => console.log(`Error fetching cafes: ${err}`));

// saving the data
form.addEventListener("submit", e => {
  e.preventDefault();
  db.collection("cafes").add({
    name: form.name.value,
    city: form.city.value
  });
  form.name.value = "";
  form.city.value = "";
});

// real time data, real time listener
db.collection("cafes")
  .orderBy("city")
  // returns the current database snapshot
  .onSnapshot(snapshot => {
    // if anything changes docChanges() is like a subscription, it makes it re-render
    const changes = snapshot.docChanges();
    changes.forEach(item => {
      // the first time the website loads it reads the current items in the database as added changes and just renders them
      if (item.type === "added") renderCafe(item.doc);
      else if (item.type === "removed") {
        const liDelete = document.querySelector(`[data-id=${item.doc.id}]`);
        cafeList.removeChild(liDelete);
      }
    });
  });

// updating something in our database
// db.collection("cafes")
//   .doc("the id")
//   .update({
//     name: "new name"
//   });

// we could use .set instead of update, but it completely modifies the entire document. if we do .set({name: 'hello'}) that would also change the city to empty
