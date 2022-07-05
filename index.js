const classSelector = document.getElementById('class-select')
const baseImgUrl = 'https://www.dndbeyond.com/attachments/thumbnails/0/'
const profList = document.getElementById('proficientcies-list')
const charImg = document.getElementById('char-img')
let spellList = document.getElementById('spell-list')
//Custom stuff
let buildSection = document.querySelector('#build-section')
let myBuilds = document.querySelector('#my-builds')
let saveClassBtn = document.querySelector('#save-class')
let savedClassesList = document.querySelector('#my-builds')

let cloneBtn = document.querySelector('#clone-btn')

const portraitMap = {
    'barbarian': '679/400/417/c3barbarianintro.png',
    'bard': '684/400/406/c3bardintro.png',
    'cleric': '687/380/437/c3clericintro.png',
    'druid': '693/400/399/c3druidintro.png',
    'fighter':'697/400/475/c3fighterintro.png',
    'paladin': '701/400/473/c3paladinintro.png',
    'monk': '700/400/490/c3monkintro.png',
    'ranger': '707/400/444/c3rangerintro.png',
    'rogue': '709/375/480/c3rogueintro.png',
    'sorcerer':'712/400/517/c3sorcererintro.png',
    'wizard':'717/400/484/c3wizardintro.png',
    'warlock':'716/400/512/c3warlockintro.png'
 }

const classArr = []

let tempClass = {
  name: 'temp',
  proficienties: [],
  spells: [],
  characterImg: '',
}
let spells = []
let profArr = []
let charImgSrc = ''
let currentChar



const postChar = async (charName1, arr, arr2, img5) => {
  req = await fetch('http://localhost:3000/characters', {
    method: 'POST',
    headers:{'content-type':'application/json', 'Accept': 'application/json'},
    body:JSON.stringify({name: charName1,
  proficienties: arr,
  spells: arr2,
  characterImg: img5,
  })

  })
  res = await req.json()
}

const getChar = async () => {
req = await fetch('http://localhost:3000/characters', {
  method: 'GET',
  headers: {'Accept': 'application/json', 'content-type': 'application/json'}
})
return res = await req.json()
}

saveClassBtn.addEventListener('click', async (e) => {
  e.preventDefault()
  buildSection.innerHTML = ''
  let data = await getChar()
  option = document.createElement('option')
  option.innerText = data[1].name
  savedClassesList.append(option)
})

const loadCustomOptions = async() => {
data = await getChar()
data.forEach((char) => {
  option = document.createElement('option')
  option.textContent = char.name
  savedClassesList.append(option)
}
)}


savedClassesList.addEventListener('change', async (e) => {
data = await getChar()
currentChar = e.target.value

data.forEach((char) => {
  if (currentChar == char.name){
  let customCharName = document.createElement('h3')
  customCharName.textContent = currentChar
  let customCharImg = document.createElement('img')
  customCharImg.setAttribute('src', char.characterImg)
  let customCharProfList = document.createElement('ul')
    char.proficienties.forEach((prof) => {
    li = document.createElement('li')
    li.textContent = prof
    customCharProfList.append(li)
})
let customCharSpellList = document.createElement('ul')
  char.spells.forEach((spell) => {
  li = document.createElement('li')
  li.textContent = spell
  customCharSpellList.append(li)
}) 
buildSection.append(customCharName, customCharImg, customCharProfList, customCharSpellList)
  }
})




})

let request = async () => {
  // initiate request to dnd server
  let req = await fetch('https://www.dnd5eapi.co/api/classes')
  // get response from server and convert it to JSON
  let res = await req.json()
  res.results.forEach((char) => {
    let option = document.createElement('option')
    option.setAttribute('value', char.name)
    option.innerText = char.name
    classSelector.append(option)
  })


  

classSelector.addEventListener('change', async (e) => {
    document.getElementById('seleted-class').innerText = e.target.value
    let src = `${baseImgUrl}${portraitMap[e.target.value.toLowerCase()]}`
    charImgSrc = src.slice()
    charImg.setAttribute('src', src)
    charImg.classList.remove('hidden')
    req = await fetch(`https://www.dnd5eapi.co/api/classes/${e.target.value.toLowerCase()}`)
    res = await req.json()
    profList.innerHTML = ''
    res.proficiencies.forEach((prof) => {
        let li = document.createElement('li')
        li.innerText = prof.name
        profArr.push(prof.name)
        profList.append(li)
        
    })
    profList.classList.remove('hidden')
  })
} 

classSelector.addEventListener('change', async (e) => {
  document.getElementById('seleted-class').innerText = e.target.value

  req = await fetch(`https://www.dnd5eapi.co/api/classes/${e.target.value.toLowerCase()}/spells`)
  res = await req.json()
  spellList.innerHTML = ''
  res.results.forEach((spell) => {
        li = document.createElement('li')
        li.innerText = spell.name
        spellList.append(li)
        spells.push(spell.name)
        //tempClass.spells.push(spell.name)
  })
  spellList.classList.remove('hidden')
})

cloneBtn.addEventListener('click', () => {
buildSection.innerHTML = ''
let classObj = {...tempClass}
let name = document.querySelector('#seleted-class').innerText
classObj.name = name
classObj.spells = spells
classObj.proficienties = [...profArr]
classObj.characterImg = charImgSrc
classArr.push(classObj)
postChar(name, classObj.proficienties, spells, charImgSrc)
spells = []
charImgSrc = ''
profArr = []
currentChar = classArr[classArr.length-1]
customCharName = document.createElement('h3')
customCharName.textContent = currentChar.name
customCharImg = document.createElement('img')
customCharImg.setAttribute('src', currentChar.characterImg)
customCharProfList = document.createElement('ul')
currentChar.proficienties.forEach((prof) => {
  li = document.createElement('li')
  li.textContent = prof
  customCharProfList.append(li)
})
customCharSpellList = document.createElement('ul')
currentChar.spells.forEach((spell) => {
  li = document.createElement('li')
  li.textContent = spell
  customCharSpellList.append(li)
}) 
buildSection.append(customCharName, customCharImg, customCharProfList, customCharSpellList)
})
request()
loadCustomOptions()



