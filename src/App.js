import React, { Component } from 'react';
import './App.css';
import InitMap from './components/InitMap';
import Header from './components/Header';
import SideBar from './components/SideBar';
import * as places from './components/places_sf.json'
import * as wiki from './components/wiki.json'

class App extends Component {

  constructor() {
    super();
    this.state = {
      center: { lat: 37.774929, lng: -122.419416 },
      zoom: 12,
      map: '',
      wiki: wiki,
      marker: places,
      infowindows: '',
      clickedMarker: ''
    }
    
    window.initMap = this.initMap
  }
  
  componentDidMount() {  
    // makeing script tag for the map
    const scriptTag = document.querySelector('script')
    const mapTag = document.createElement('script')
    
    mapTag.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAK1xWC8cosON1_4ta09cj6WpAKPNIb4aE&callback=initMap'
    mapTag.async = true
    mapTag.defer = true

    mapTag.onerror = () => alert('Error: somthing wrong with the map, please refresh the page')

    scriptTag.parentNode.insertBefore(mapTag, scriptTag);
  }
  
  // initializing map
  initMap = () => {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: this.state.center,
      zoom: this.state.zoom,
      gestureHandling: 'greedy',
    })
    this.setState({ map: map })
    this.initMarkers(map)
    this.fillWiki()
    this.initInfoWindow()
  }
  
  // initializing markers
  initMarkers = map => { 
    let mapMarker = []
    this.state.marker.forEach((marker, index) => {
      mapMarker[index] = new window.google.maps.Marker({
        map: map,
        animation: window.google.maps.Animation.DROP,
        position: marker,
        title: marker.title,
        id: index,
        icon: 'http://maps.google.com/mapfiles/ms/micons/red-pushpin.png'
      })
    })
    
    this.setState(prevState => ({
      mapMarkers: mapMarker
    }))
  }

  // initializing infowindow
  initInfoWindow = () => {
    let mapMark = [...this.state.mapMarkers]
    
    let infowindow = new window.google.maps.InfoWindow({
      maxWidth: 260
    })

    infowindow.addListener('closeclick', this.closeInfo)

    this.setState(prevState => ({
      infowindows: infowindow
    }))
    
    mapMark.map((item, index) => {
      return (
        item.addListener('click', () => {  
          this.closeInfo()
          item.setAnimation(window.google.maps.Animation.BOUNCE)
          item.setIcon('http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png')

          this.state.map.setCenter(item.position)
          this.state.infowindows.open(this.state.map, item)
          this.state.infowindows.setContent(`<h2>${item.title}</h2><img width="250px" src="${this.state.wiki[index].thumb}" alt="${this.state.wiki[index].title}"</img><p><b>${this.state.wiki[index].description}</b></p><p>Powered by Wikipedia</p>`)
          
          this.setState(prevState => ({
            clickedMarker: item
          }))
        })
      )
    })
  
    this.setState(prevState => ({
      mapMarkers: mapMark
    }))
  }

  closeInfo =() => {
    if (this.state.clickedMarker) {
      this.state.clickedMarker.setAnimation(null)
      this.state.clickedMarker.setIcon('http://maps.google.com/mapfiles/ms/micons/red-pushpin.png')
    }
    this.setState(prevstate => ({
      clickedMarker: ''
    }))
  }
    
  //receive wikipedia data
  fillWiki = () => {
    let wikiArray = [...this.state.wiki]

    wikiArray.forEach(id => {
      const search = `https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=pageimages%7Cdescription&piprop=thumbnail&pithumbsize=250&wbptterms=description&format=json&formatversion=2&pageids=${id.pageId}`

      fetch(search)
        .then(resp => resp.json())
        .then(data => {
          
          if (!data.query.pages[0].thumbnail) {
            id.thumb = "https://www.freeiconspng.com/uploads/no-image-icon-15.png"
          }
          else {
            id.thumb = data.query.pages[0].thumbnail.source
          }
          if (data.query.pages[0].description) {
            id.description = data.query.pages[0].description
          }
          else {
            id.description = "No description available1"
          }
         
          id.title = data.query.pages[0].title
        })
        .catch(error => {
          alert('Error: Wikipedia is not responding')
          console.log(error)
        })
    })

    this.setState(prevState => ({
      wiki: wikiArray
    }))
  }

  render() {
    return (
      <div className="App">
        <Header />
        <SideBar marker={this.state.marker} mapMarkers={this.state.mapMarkers} map={this.state.map} infowindows={this.state.infowindows} wiki={this.state.wiki}/> 
        <InitMap />
      </div>
    )
  }
}

export default App;
