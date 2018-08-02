import React from 'react';

const SideBar = props => {

    let marker = props.marker
    let mapMarkers = props.mapMarkers
    let map = props.map
    let infowindows = props.infowindows
    let wiki = props.wiki
       
    const markerTitle = []
        for (let i = 0; i < marker.length; i++) {
            markerTitle[i] = marker[i].title
        }
    
    // handling listview
    const markerHandler = event => {
        mapMarkers.map((item, index) => {
            if (item.title === event.target.innerText) {
                item.setAnimation(window.google.maps.Animation.BOUNCE)
                item.setIcon('http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png')
                map.setCenter(item.position)
                infowindows.open(map, item)
                infowindows.setContent(`<h2>${item.title}</h2><img src="${wiki[index].thumb}"</img><p><b>${wiki[index].description}</b></p><p>Powered by Wikipedia</p>`)
            }

            else {
                item.setAnimation(null)
                item.setIcon('http://maps.google.com/mapfiles/ms/micons/red-pushpin.png')
            }
        })
    }

    // handling search filter
    const searchHandler = event => {
        mapMarkers.filter(item => {
            if (!item.title.toLowerCase().includes(event.target.value)) {
                item.setMap(null)
            }
            else {
                item.setMap(map)
            }
        })
        
        const menuItems = document.querySelectorAll('.listItem')
        menuItems.forEach(menuItem => {
            if (!menuItem.innerText.toLowerCase().includes(event.target.value)) {
                menuItem.style.display = 'none'
            }
            else {
                menuItem.style.display = 'block'
            }
        })
    }

    return(
            
        <div id="sidebar" className="sidebar">
            Places of interest
            <input id="input" type="text" onChange={searchHandler} placeholder="search" />
            <ul id="menu" role="menu" aria-label="places of interest">{markerTitle.map(title => 
                <li role="menuitem" tabIndex="0" className="listItem" onClick={markerHandler} onKeyPress={markerHandler} key={title}>{title}</li>
            )}</ul>

        </div>
    )
}

export default SideBar