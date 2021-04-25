import React, { Component } from 'react';
import {Grid} from 'semantic-ui-react';
import TVShow from './TVShow'

class TVShowList extends Component {
  
  mapAllShows = () => {
    if (!!this.props.searchTerm){
      return this.props.shows.map((s) => { //added return
        if (s.name.toLowerCase().includes(this.props.searchTerm)){
          return (<TVShow show={s} key={s.id} selectShow={this.props.selectShow}/> ) //added return
        }
      })
    }
    return this.props.shows.map((s)=> <TVShow show={s} key={s.id} selectShow={this.props.selectShow}/>)
  }

  render() {
    return (
      <div className="TVShowList">
        <Grid className="TVShowGrid">
          {this.mapAllShows()}
        </Grid>
      </div>
    )
  }

}

export default TVShowList;
