import React, { Component } from 'react';
import { Typography, withStyles } from "@material-ui/core";
import Divider from '@material-ui/core/Divider';
import index from '../Assets/index.png';
import cssStyles from '../Assets/styles.png';
import draw from '../Assets/draw.png';
import draw2 from '../Assets/draw2.png';
import snake from '../Assets/snake.png';
import snake2 from '../Assets/snake2.png';
import snake3 from '../Assets/snake3.png';
import fruit from '../Assets/fruit.png';
import result from '../Assets/result.png';

const styles = theme => ({
  root: {
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'center'
  },
  header: {
    color: theme.palette.text.secondary,
    marginTop: '1rem',
    marginBottom: '1rem'
  },
  subHeader: {
    color: theme.palette.text.main,
    marginTop: '0.5rem',
    marginBottom: '0.5rem'
  },
  paragraph: {
    backgroundColor: 'white',
    width: '85%',
    height: 'auto',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: 'thin',
    padding: '1rem',
    paddingLeft: '2rem'
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'underline',
    '&:hover': {
      color: theme.palette.primary.light
    }
  },
  nestedParagraph: {
    paddingLeft: '2rem'
  },
  paragraphEnd: {
    height: '1rem'
  },
  divider: {
    width: '100%',
  },
  topSpace: {
    height: '1vh'
  },
  bottomSpace: {
    height: '10vh'
  }
})

class Snakegame extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <span className={classes.topSpace}/>
        <Typography variant='h2' component='h2'>Snake Game</Typography>
        <ul className={classes.paragraph}>
            <li>Suppose you have your own portfolio website created now.</li>
            <li>You can actually edit your portfolio files yourself to achieve amazing effects.</li>
            <li>In this guide, we will show you how to create a snake game using files that you would typically obtain for your portfolio website.</li>
            <li>Throughout this guide, we will be using SublimeText to edit the portfolio website files. You can download it here https://www.sublimetext.com/3</li>
        </ul>

        <Typography className={classes.header} variant='h5' component='h5'>Obtaining the files needed</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.subHeader} variant='h6' component='h6'>User</Typography>
        <div className={classes.paragraph}>
            <li>If you had created your portfolio website as a user, you would need to open your Github account.</li>
            <li>Recall the name of the Github repository that you pushed your portfolio files to when creating your portfolio website.</li>
            <div className={classes.nestedParagraph}>
                <li>If you forgot, just check your website link. Assume that your-github-username is your Github username here.</li>
                <li>If your portfolio website is https://your-github-username.github.io, then your Github repository is "your-github-username.github.io".</li>
                <li>
                    If your portfolio website is https://your-github-username.github.io/skills or https://your-github-username.github.io/skills/.../..., then
                    your Github repository in this case is "skills".
                </li>
            </div>
            <li>In your Github account, open the Github repository, then click on the green Code button. Select download ZIP.</li>
            <li>Your portfolio website files will be downloaded as a zip. Extract it into a folder and remember the name of the folder. It will be used later.</li>
            <li>In this folder, click on the index.html. A tab in your browser will open, allowing you to view edits made to your web page.</li>
            <li>Take note that to view any changes made, the web page would have to be refreshed.</li>
        </div>

        <Typography className={classes.subHeader} variant='h6' component='h6'>Guest</Typography>
        <div className={classes.paragraph}>
            <li>If your are guest, you would have downloaded a zip file from publishing your portfolio website.</li>
            <li>Extract the contents of the zip file into a folder and remember the name of the folder. It will be used later.</li>
            <li>In this folder, click on the index.html. A tab in your browser will open, allowing you to view edits made to your web page.</li>
            <li>Take note that to view any changes made, the web page would have to be refreshed.</li>
        </div>
        
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.header} variant='h5' component='h5'>Editing the index.html</Typography>
        <div className={classes.paragraph}>
            <li>In short, index.html is a html file, which forms the structure of a web page with its html elements as the building blocks.</li>
            <li>First, you should reformat the html into a more organized form.</li>
            <li>We want an element that can run javascript functions to render the game. The canvas element is designed for such a purpose.</li>
            <li>We will also need a button to start/restart the snake game.</li>
            <div className={classes.imageContainer}>
                <img src={index} alt="index.html example"/>
            </div>
            <li>The canvas element is given 300px in both height and width.</li>
            <li>We will wrap the canvas element in a div element, which we will customize using css later.</li>
            <li>Then we will also wrap the above div element with the canvas element and the button element together in another div element, which we will customize using css later as well.</li>
            <li>Notice that we have 3 script elements at the end, which will embed the Javascript code that we will write later to handle the game logic.</li>
        </div>
        <span className={classes.paragraphEnd} />

        <Typography className={classes.header} variant='h5' component='h5'>Editing the styles.css</Typography>
        <div className={classes.paragraph}>
            <li>In short, styles.css is a css file, which describes how html elements are to be displayed on screen.</li>
            <li>
                We can see in index.html that we have added "class=..." in the 2 div elements and the canvas and button elements. 
                Here, class would reference the css class which we will be defining.
            </li>
            <div className={classes.imageContainer}>
                <img src={cssStyles} alt="styles.css example"/>
            </div>
            <li>The image above shows a snippet of the styles.css that you would have. Simply scroll to the bottom and add the required css classes.</li>
            <li>In this case, the canvas class is given a greyish background color, which will be used by the canvas element.</li>
            <li>Margin defines the space surrounding the html element itself. The playButton class is given a margin of 0.5 rem to separate it from the canvas element by that screen distance.</li>
            <li>As for snake-container and game-container, they are given a display of flex and related attributes. You can visit https://css-tricks.com/snippets/css/a-guide-to-flexbox/ to learn more.</li>
            <li>Refresh the web page opened earlier to view the changes made to your portfolio website.</li>
        </div>
        <span className={classes.paragraphEnd} />

        <Typography className={classes.header} variant='h5' component='h5'>Adding Javascript files</Typography>
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.header} variant='h6' component='h6'>draw.js</Typography>
        <div className={classes.paragraph}>
            <li>In short, we will use javascript here to dynamically update content that we are rendering on the web page.</li>
            <li>First, we will create a draw.js file in the same folder that you extracted your portfolio website files to.</li>
            <li>Open up the draw.js in the SublimeText editor. We will assign html elements to variable names</li>
            <div className={classes.imageContainer}>
                <img src={draw} alt="draw.js example"/>
            </div>
            <li>
                In lines 1 and 2, we used css selectors to obtain the first element using the canvas css class and the playButton css class, 
                which are the canvas and button element respectively.
            </li>
            <li>The canvas and button elements are then assigned to variable names canvas and playButton respectively.</li>
            <li>In line 3, since canvas refers to the canvas element, we can call getContext method on it to obtain its drawing context, which we will use to dynamically update visuals later.</li>
            <li>We then set up the foundations for a grid of square blocks 10px wide.</li>
            <li>A setup function is created. This setup function initializes the Snake and Fruit function objects and sets playing boolean to true.</li>
            <div className={classes.nestedParagraph}>
                <li>At this point, the Snake and Fruit constructors have not been created, but will be later. These constructors will create their function objects.</li>
                <li>The Snake function object will have the update, eat, changeDirection and draw methods.</li>
                <li>The Fruit function object will have the draw and pickLocation methods.</li>
                <li>At this point, the logic here is that we call update method on the Snake function object to update its render location first.</li>
                <li>We also call draw method on both the Snake and Fruit objects to actually render their locations visually on the canvas context.</li>
                <li>From line 27 to 29, we have a conditional to check if the snake head location falls on the fruit's location and if so, we increase snake body size and change fruit location.</li>
            </div>
            <li>
                An interval task running at 100ms intervals will be created and assigned to variable name renderer, 
                which will constantly update and draw the new positions of the snake body and the fruit.
            </li>
            <li>
                A stop function is also created. This will call clearInterval on renderer, which is the interval task just created. 
                This will cause the interval task to stop running and be removed.
            </li>
            <li>
                Then at line 41, we add an event listener for the "click" event to the button element, so that we can start the game if it is not running by calling setup function, 
                and stop the game if it is running by calling stop function.
            </li>
            <div className={classes.imageContainer}>
                <img src={draw2} alt="draw.js example"/>
            </div>
            <li>From line 44 to line 61, we add an event listener to the window, which is your browser, to check for Arrow Up, Down, Left, Right actions</li>
            <li>The key field of the event listened to by the browser will contain the type of key action that the user inputs.</li>
            <li>We put this key field through a switch statement and call changeDirection method from the Snake function object to change the direction in which the Snake is travelling.</li>
        </div>
        <span className={classes.paragraphEnd} />

        <Typography className={classes.header} variant='h6' component='h6'>snake.js</Typography>
        <div className={classes.paragraph}>
            <li>Next, we have to create a snake.js file in the same folder.</li>
            <li>As mentioned previously, we will need draw, eat, changeDirection and update methods in our Snake function object.</li>
            <div className={classes.imageContainer}>
                <img src={snake} alt="snake.js example"/>
            </div>
            <div className={classes.imageContainer}>
                <img src={snake2} alt="snake.js example"/>
            </div>
            <li>We will be using the Snake function object to keep track of its own location and manage its own movement direction.</li>
            <div className={classes.nestedParagraph}>
                <li>As such, we need x and y coordinates that belongs to the Snake function object itself. Hence we assign this.x and this.y to 0 initially as the starting position.</li>
                <li>
                    We also need horizontal and vertical velocity that again belongs to the Snake function object itself. 
                    Hence we assign this.xSpeed and this.ySpeed to scale and 0 initially.
                </li>
                <li>
                    Remember that we are rendering the Snake body in terms of grid blocks. 
                    That is why we assign this.xSpeed to scale variable referenced from draw.js to allow the Snake to move right initially.
                </li>
            </div>
            <li>From line 9 to line 17, we declare the draw method.</li>
            <div className={classes.nestedParagraph}>
                <li>We set the fillStyle to be white or #FFFFFF, then call fillRect on the canvas context "ctx" referenced from draw.js.</li>
                <li>From line 12 to line 14, we create a loop to call fillRect on each coordinate object in the tail array belonging to the Snake function object, which renders the snake body.</li>
                <li>Finally in line 16, we also call fillRect on the Snake function object's current coordinate, which renders the snake head.</li>
                <li>As a whole, the draw function will render the entire snake, both head and body.</li>
            </div>
            <li>From line 19 to line 84, we declare the update method. Seems long? Don't worry we'll break it down for you.</li>
            <li>From line 20 to line 34, we will handle case for when the snake head coordinates meets the coordinates of its body.</li>
            <div className={classes.nestedParagraph}>
                <li>First, we initialize a boolean isDelete to determine if we need to cut the Snake body and counter deleteCount to track how many blocks we need to cut off from the snake body.</li>
                <li>We designed the tail array to go from end of the snake body to the start of the snake body.</li>
                <li>From line 23 to line 29, we start a loop, checking each coordinate object from the start to end of the array.</li>
                <li>From line 25 to line 27, we have a conditional that breaks the loop if the coordinate object's x field and y field matches this.x and this.y respectively.</li>
                <li>If the conditional evaluates to true, it means contextually that the Snake head has hit its body. We set isDelete boolean to true to delete part of the Snake body later.</li>
            </div>
            <li>
                From line 31 to line 34, we slice the array starting from the deleteCount inclusively to the end of the array, 
                which essentially removes all blocks in the snake's body after the block that collided with the Snake's head.
            </li>
            <li>We also subtract the deleteCount from this.total so that the total number of blocks in the Snake's body is updated.</li>
            <li>From line 36 to line 38, we esssentially left shift every coordinate object in the tail array except the last.</li>
            <li>
                In line 40, since we left shifted every coordinate object, the first object is removed and the last object is a duplicate. 
                We replace the last object with the Snake head's coordinate or this.x and this.y.
            </li>
            <li>From line 42 to line 83, we begin by adding the xSpeed and ySpeed to this.x and this.y to visually create a movement in the Snake's body.</li>
            <li>We then handle cases whereby the Snake's head hits the perimeters of the canvas element.</li>
            <li>From line 86 to line 92, we declare the eat method.</li>
            <div className={classes.nestedParagraph}>
                <li>The eat function takes in a Fruit function object as its argument, then compares the coordinates of the Fruit function object with that of the Snake function object's.</li>
                <li>If the conditional evaluates to true, then the Snake head has collided with the fruit. We will increase this.total to increase the number of blocks in the Snake's body.</li>
                <li>Take note that we still have to return true and false to determine if a new Fruit location has to be determined. This is required in draw.js.</li>
            </div>
            <div className={classes.imageContainer}>
                <img src={snake3} alt="snake.js example"/>
            </div>
            <li>From line 94 to line 115, we declare the changeDirection method.</li>
            <div className={classes.nestedParagraph}>
                <li>
                    The changeDirection takes in a string as its direction argument. 
                    Recall that we created an event listener calling the respective changeDirection method of the Snake function object for the arrow key pressed.
                </li>
                <li>Here, we define this.xSpeed and this.ySpeed to match the direction that the Snake is supposed to move to depending on the direction argument.</li>
            </div>
        </div>
        <span className={classes.paragraphEnd} />

        <Typography className={classes.subHeader} variant='h6' component='h6'>fruit.js</Typography>
        <div className={classes.paragraph}>
            <li>Next, we have to create a fruit.js file in the same folder.</li>
            <li>As mentioned previously, we will need draw and pickLocation methods in our Fruit function object.</li>
            <div className={classes.imageContainer}>
                <img src={fruit} alt="fruit.js example"/>
            </div>
            <li>We will be using the Fruit function object to keep track of its own location, hence we need x and y coordinates to belong to the Fruit function object itself.</li>
            <li>As such, we create this.x and this.y fields.</li>
            <li>From line 5 to line 8, we declare the pickLocation method.</li>
            <div className={classes.nestedParagraph}>
                <li>We randomize x and y coordinate values that is within the perimeters of the canvas context, then assign them to this.x and this.y fields.</li>
            </div>
            <li>From line 10 to line 13, we declare the draw method.</li>
            <div className={classes.nestedParagraph}>
                <li>We set the fillStyle to a fruit-like color</li>
                <li>Just like in Snake's draw method, we also call fillRect on the canvas context "ctx" referenced from draw.js.</li>
            </div>
        </div>
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>

        <Typography className={classes.header} variant='h5' component='h5'>Uploading the edited files.</Typography>
        <div className={classes.paragraph}>
            <li>
                {`To reupload the edited files to reflect changes in your portfolio website, look into `}
                <span className={classes.link}>Guest Deploy</span>
                {` for either Github or InfinityFree guides.`}
            </li>
            <li>If done correctly, you should see something like this as your resulting portfolio website.</li>
            <div className={classes.imageContainer}>
                <img src={result} alt="result example"/>
            </div>
        </div>
        <span className={classes.paragraphEnd} />
        <Divider orientation="horizontal" className={classes.divider}/>

        <span className={classes.bottomSpace}/>
      </div>
    )
  }
}

export default withStyles(styles)(Snakegame);