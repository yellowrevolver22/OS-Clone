const searchBar = document.querySelector('#search-bar');

function SearchWorking(){
  searchBar.addEventListener('keydown',(event)=>{
    if(event.key=='Enter'){
      const query = searchBar.value.trim();
      document.querySelector('.web-view').src=`https://en.wikipedia.org/wiki/${query}`
    }
  })
}

SearchWorking();