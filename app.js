const result = document.getElementById('result')
const filter = document.getElementById('filter')
const listItems = []

filter.value = ''

getData()

const n_li = document.createElement('li')
n_li.id = 'noresult'
n_li.classList.add('hide')
n_li.innerHTML=`<h3>No user found</h3>`


filter.addEventListener('input', (e) => {
  filterData(e.target.value)
})


async function getData(){
  const res = await fetch('https://randomuser.me/api?results=50')

  const {results} = await res.json()

  // Clear result
  result.innerHTML = ''

  result.appendChild(n_li)

  results.forEach(user => {
    const li = document.createElement('li')

    li.innerHTML=`
      <img src="${user.picture.large}" alt="${user.name.first}">
      <div class="user-info">
        <h4>${user.name.first} ${user.name.last}</h4>
        <p>${user.location.city}, ${user.location.country}</p>
      </div>
    `
    listItems.push(li)

    result.appendChild(li)
  })

}

function filterData(search){
  n_li.classList.add('hide')
  let empty = true
  listItems.forEach(item => {
    if(item.innerText.toLowerCase().includes(search.toLowerCase())){
      if(empty){empty = false}
      item.classList.remove('hide')
    }else{
      item.classList.add('hide')
    }
  })
  if(empty){n_li.classList.remove('hide')}
}

