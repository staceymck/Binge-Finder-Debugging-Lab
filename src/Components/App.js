import React, { Component } from 'react';
import Adapter from '../Adapter';
import TVShowList from './TVShowList';
import Nav from './Nav';
import SelectedShowContainer from './SelectedShowContainer';
import { Grid } from 'semantic-ui-react';



class App extends Component {
  state = {
    shows: [],
    searchTerm: "",
    selectedShow: "",
    episodes: [],
    filterByRating: "",
    page: 0,
    scrolling: false
  }

  componentDidMount = () => {
    window.addEventListener('scroll', () => {this.setState({scrolling: true})})
    Adapter.getShows(this.state.page).then(shows => this.setState({shows}))

    this.timerId = setInterval(() => {
      if (this.state.scrolling) {
          this.setState({scrolling: false})
          this.infiniteScroll()
      }
    }, 500)
  }

  scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  componentWillUnmount = () => {
    clearInterval(this.timerId)
  }

  infiniteScroll = () => {
    let scrollHeight = Math.max(
      document.body.scrollHeight, document.documentElement.scrollHeight,
      document.body.offsetHeight, document.documentElement.offsetHeight,
      document.body.clientHeight, document.documentElement.clientHeight
    )

    if (document.documentElement.clientHeight + window.scrollY > scrollHeight - 300 && this.state.page < 220) {
      
      this.setState(state => {
        return {
          page: state.page + 1
        }
      })
      
      Adapter.getShows(this.state.page)
      .then(newShows => {
        console.log(newShows)
          this.setState(state => {
            return {
              shows: state.shows.concat(newShows)
            }
          })
      })
      .catch(error => console.log("issue"))
      
    }
  }

  // infiniteScroll = (e) => {
  //   if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
  //   //if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight){
  //     // const lastLi = document.querySelector(".TVShowGrid > div:last-child");
  //     // const lastLiOffset = lastLi.offsetTop + lastLi.clientHeight;
  //     // const pageOffset = window.pageYOffset + window.innerHeight;
  //     // if (pageOffset > lastLiOffset) {
  //       console.log("bottom")
  //       this.setState(state => {
  //         return {
  //           page: state.page + 1
  //         }
  //       }, () => console.log(this.state.page))
  //       Adapter.getShows(this.state.page)
  //       .then(newShows => {
  //         if(newShows) {
  //           this.setState(state => {
  //           return {
  //             shows: [...state.shows, newShows],
  //             loading: false
  //           }
  //           }, () => console.log(this.state.shows))
  //         } else {
  //           this.setState({loading: false, endOfShows: true})
  //         }
  //       })
  //     }
  // }

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value.toLowerCase() })
  }

  handleFilter = (e) => {
    e.target.value === "No Filter" ? this.setState({ filterByRating:"" }) : this.setState({ filterByRating: e.target.value})
  }

  selectShow = (show) => {
    Adapter.getShowEpisodes(show.id)
    .then((episodes) => this.setState({
      selectedShow: show,
      episodes
    }))
    this.scrollToTop()
  }

  displayShows = () => {
    if (this.state.filterByRating){
      return this.state.shows.filter((s)=> {
        return s.rating.average >= this.state.filterByRating
      })
    } else {
      return this.state.shows
    }
  }

  render(){
    return (
      <div>
        <Nav handleFilter={this.handleFilter} handleSearch={this.handleSearch} searchTerm={this.state.searchTerm}/>
        <Grid celled >
          <Grid.Column width={5}>
            {!!this.state.selectedShow ? <SelectedShowContainer selectedShow={this.state.selectedShow} episodes={this.state.episodes}/> : <div/>}
          </Grid.Column>
          <Grid.Column width={11} >
            <TVShowList shows={this.displayShows()} selectShow={this.selectShow} searchTerm={this.state.searchTerm} />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
