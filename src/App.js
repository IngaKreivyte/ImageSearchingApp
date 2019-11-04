import React , {useState, useEffect}from 'react';
import Container from 'react-bootstrap/Container';
import {Card, CardColumns,} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faExclamation } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './App.css';

const Home = props => {
  const [val, setVal] = useState('');
  const [pictures,setPictures] = useState([]);
  const [images,setImages] = useState([]);
  const [keywords,setKeywords] = useState([]);
  const [key,setKey] = useState([]);
  const [tagName, setTagName]=useState([]);
  const [errors, setErrors]=useState([]);
  const [modal,setModal]=useState(false);

  useEffect(()=>{
    if(keywords<=0){
      setKeywords(JSON.parse(localStorage.getItem('keywords')));
    } else {
      setKey(keywords)
    }
    fetchData();  
      return()=>{
        console.log('cleaning up');
        setErrors([])
      }
  },[keywords] );

  const fetchData = ()=>{
    fetch('https://api.unsplash.com/photos/?client_id=90ed0b972bfde22b85b602119b8358a6a04ac9728771f3dcd391679653c5c9fc', {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            })
            .then((response) => {
              return response.text();
            })
            .then((data) => {
              setPictures( JSON.parse(data)) 
            });
  }
    
  const onSearchSubmit = async (term) => {
      setTagName(term);
      try {
        const response = await axios.get('https://api.unsplash.com/search/photos', {
          params: { query: term},
          headers: {
            Authorization: 'Client-ID 90ed0b972bfde22b85b602119b8358a6a04ac9728771f3dcd391679653c5c9fc'
          }
        })
      if(response.data.total>0) {
        return (
          setImages(response.data.results),
          setErrors([]),
          val.length > 0 ?  key.push(val) : '',
          localStorage.setItem('keywords', JSON.stringify(key)),
          setKeywords(JSON.parse(localStorage.getItem('keywords'))),
          setVal([])
        )
      }
      else return (
          setErrors('Unfortunately, Images are not found'),
          setImages([]),
          setVal([]),
          setModal(true)
        )
      } catch (error) {
          console.log(error);
        }  
  }
    const onFormSubmit = (event) => {
      event.preventDefault();
      if(val.length>0) return onSearchSubmit(val);
      if(val.length<=0) return null;
    }

    const onInputChange = (event) => {
     if(event.target.value.length>0)  return setVal( event.target.value);
    }
      let showSearchImages= images.map((image,i)=>{
        return (
          <Card style={{marginTop:'10px'}} key= {i} > 
            <Card.Img src={image.urls.regular}  style={{margin:'0', padding:'0', width:'100%', height:'auto'}} alt={image.alt_description}   />
          </Card>
        )
      })
    const showImg=pictures.map((image,i)=>{
      return (
        <Card style={{marginTop:'10px'}} key= {i} > 
          <Card.Img src={image.urls.regular} style={{margin:'0', padding:'0', width:'100%', height:'auto'}} alt={image.alt_description}   />
        </Card>
      )
    })  
        return (
            <Container fluid  className="container">
              <div className="topcontainer">
                <form onSubmit={onFormSubmit}  style={{ position:'absolute', top:'30%', width:'100%'}}>
                  <label style={{width:'100%'}}><h2 > Search Images </h2></label>
                  <input 
                    type="text"
                    placeholder='Search free photos...'
                    value={val}
                    onChange={onInputChange}
                  />
                  <button><FontAwesomeIcon icon={faSearch}/></button>
                </form>
              </div>
              <div style={{backgroundColor:'orange',color:'white',padding:'20px 0', textAlign:'center'}}> 
                {images.length>0 ? `Images related searches to “`+tagName+`“ ` : 'Random Images' } 
              </div>
              <div className="keyContainer">{key && key.filter((item,index,self)=>self.indexOf(item) === index).map((item,i)=>{
                return <button key={i} onClick={()=>{onSearchSubmit(item)}}>{item} </button>})}
              </div>
              {images.length<=0 &&
                <div> <CardColumns> {showImg} </CardColumns></div>}
              <div>
                <CardColumns>{showSearchImages}</CardColumns>
              </div>
              {modal===true && 
                <React.Fragment>
                  <div style={{width:'100%',height: '100vh',background: 'rgba(230, 222, 222, 0.4)',position: 'fixed',left: 0,top: 0, zIndex: 2}}/>
                  <div style={{position: 'fixed',left: '50%',top: '50%',borderRadius: '5px',transform:'translate(-50%,-50%)',padding: '20px 40px',textAlign: 'center',zIndex: 3, backgroundColor: 'white', width:'60%',height: '50%'}}>
                    <div>{errors}</div>
                    <FontAwesomeIcon icon={faExclamation} style={{fontSize:'50', margin:'10% 0'}}/>
                    <div>
                      <span style={{display:'inline-block',borderRadius:'5px',width:'120px', padding:'5px',backgroundColor:'orange',color:'white',cursor:'pointer'}} onClick={()=>{setModal(false)}}> Go back</span>
                    </div>
                  </div>
              </React.Fragment>}
            </Container>
        )
}
export default Home;
