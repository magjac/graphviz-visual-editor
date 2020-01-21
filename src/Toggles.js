import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import { createMuiTheme  } from '@material-ui/core/styles';
// import { uncommonIngrList } from './utils/graph_dict'      /*uncomment when the uncommonIngerList is ready*/

const styles = {
    root: {
        display:"flex",
        justifyContent:"flex-start",
        marginTop:50,
        marginLeft:50

    },
    list:{
        width: '100%',
        maxWidth: 250,
        border:"1px solid black"
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      chip: {
        margin: 2,
      },
  };

  const muiTheme1 = createMuiTheme ({
    switch: {
      thumbOnColor: 'yellow',
      trackOnColor: 'red'
    }
  });

class TogglesPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            showConstraints:false,
            showLeastCommon:false,
            leastCommonIngredients:[],
            selectedLeastCommon:[]
        }
        this.findNodesByIngredients = props.findNodesByIngredients.bind(this);
    }

/*uncomment below function when the uncommonIngerList is ready*/
// componentDidMount(){                                                      
//     const leastCommonList = uncommonIngrList.map(obj=>obj.ingr_name);
//     this.setState({
//         leastCommonIngredients:leastCommonList
//     })
// }

 handleChangeSwitchChange = switchName => event => {
    event.persist();
    this.setState((prev) => {
        return {
            ...prev,
            selectedLeastCommon: !(event.target && event.target.checked) ? [] : [...prev.selectedLeastCommon],
            [switchName]: event.target && event.target.checked
        };
      })
      };

handleLeastCommonIngredientChange = value => () => {
    const currentIndex = this.state.selectedLeastCommon.indexOf(value);
    const newChecked = [...this.state.selectedLeastCommon];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({
        selectedLeastCommon:newChecked
    })
};

componentDidUpdate(prevProps, prevState){
    if(JSON.stringify(prevState.selectedLeastCommon) !== JSON.stringify(this.state.selectedLeastCommon)){//need to update 
        this.findNodesByIngredients(this.state.selectedLeastCommon);
    }
}




    render(){
        const { classes } = this.props;
        return(
            <div>
                <FormControl component="fieldset" className={classes.root}>
                    <FormGroup>
                    
                        <FormControlLabel
                            control={
                            <Switch checked={this.state.showLeastCommon} size="medium"  onChange={this.handleChangeSwitchChange('showLeastCommon')}/>}
                            label="Show least common ingredients"
                        />
                        {this.state.showLeastCommon && <List className={classes.list}>
                            {this.state.leastCommonIngredients.map(ingredient=>{
                                return(
                                    <ListItem key={ingredient} style={{backgroundColor: this.state.selectedLeastCommon.indexOf(ingredient) !== -1 ? "orange" : ""}}  dense button onClick={this.handleLeastCommonIngredientChange(ingredient)}>
                                        <ListItemText id={ingredient} primary={ingredient} />
                                    </ListItem>
                                )
                            })}
                        </List> 
                        }
                        <FormControlLabel
                            control={
                            <Switch checked={this.state.showConstraints} size="medium" onChange={this.handleChangeSwitchChange('showConstraints')}/>}
                            label="Add Constraints"
                        />
                    </FormGroup>
                </FormControl>
            </div>
        )
    }
}


export default withStyles(styles)(TogglesPanel);
