import React , {useState, useEffect}from 'react';
import {Container,Row, Col,Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Home = props => {
  const [val, setVal] = useState('');
  const [pictures,setPictures] = useState([]);
  const [images,setImages] = useState([]);
  const [keywords,setKeywords] = useState([]);
  const [key,setKey] = useState([]);
  const [tagName, setTagName]=useState([]);
  const [errors, setErrors]=useState([]);
  const [loading,setLoading]=useState(false)

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
    const onFormSubmit = (event) => {
      
      event.preventDefault();
      console.log(loading);
      onSearchSubmit(val);
      if(loading){
        console.log(loading);
        key.push(val);
        localStorage.setItem('keywords', JSON.stringify(key));
        setKeywords(JSON.parse(localStorage.getItem('keywords')))
      }
         else{
           return null;
         }
    }
    const onSearchSubmit = async (term) => {
      
      setTagName(term)
      try {
        setLoading(true);
      const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query: term},
            headers: {
                Authorization: 'Client-ID 90ed0b972bfde22b85b602119b8358a6a04ac9728771f3dcd391679653c5c9fc'
            }
      })
      if(response.data.total>0) {
        return (
           setImages(response.data.results),
            setErrors([]))
        }
        else return (
          setErrors('Unfortunately, Images are not found'),
          setImages([]),
          setVal([])
        )
    } catch (error) {
      setLoading(false);
      console.log(error);
      
    }
      
    }
    const onInputChange = (event) => {
      setVal( event.target.value);
    }
      let showSearchImages= images.map((image,i)=>{
        return (
          <Col  style={{margin:'10px 0 0 0'}}  key= {i} > 
            <Image  src={image.urls.regular}  width={408.5} height={400} alt={image.alt_description} rounded  />
          </Col>
        )
      })
        const showImg=pictures.map((image,i)=>{
          return (
            <Col style={{margin:'10px 0 0 0'}}  key= {i}> 
              <Image src={image.urls.regular} width={408.5} height={400} alt={image.alt_description} rounded  />
            </Col>
          )
        })
        
        return (
            <Container fluid >
              <div style={{
                backgroundImage: "url(https://images.pexels.com/photos/754082/pexels-photo-754082.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)",
                backgroundPosition: 'center',
                repeat: 'no-repeat',
                backgroundSize: 'cover',
                color:'white',
                position:'relative',
                textAlign:'center', height:'200px'}} >
                <form  onSubmit={onFormSubmit}  style={{ position:'absolute', top:'30%', width:'100%'}}>
                  <label style={{ width:'100%'}}><h2 > Search Images </h2></label>
                  <input 
                    style={{width:'50%',background:'transparent', border:' 1px solid white',outline:'none',borderRadius:"5px",color:'white', padding:'5px'}}
                    type="text"
                    placeholder='Search free photos'
                    value={val}
                    onChange={onInputChange}
                  />
                  <button style={{position:'absolute', right:'26%',top:'64%',border:'none',borderRadius:'5px', background:'transparent', color:'white', userSelect:'none',outline:'none',}}> <FontAwesomeIcon icon={faSearch}/></button>
                </form>
                <button style={{position:'absolute',top:'57%', right:'10%' ,border:'1px solid white',borderRadius:'5px',width:'80px', background:'transparent', color:'white', userSelect:'none',outline:'none',padding:'5px'}}>
                  Save 
                  <FontAwesomeIcon icon={faSave}/>
                </button>
                </div>
                <div>{key && key.filter((item,index,self)=>self.indexOf(item) === index).map((item,i)=>{
                  return <button key={i} onClick={()=>{onSearchSubmit(item)}}> {item} </button>
                })}
                </div>
                {images.length>0 &&
                  <div style={{backgroundColor:'blue',color:'white',padding:'20px 0', textAlign:'center'}}> 
                    Images related searches to “ {tagName}” 
                  </div>}
                { errors.length>0 &&
                  <div style={{backgroundColor:'red',color:'white', padding:'20px 0',textAlign:'center'}}> 
                    {errors}
                  </div>}
                  { errors.length<=0 && images.length<=0 &&
                  <div style={{backgroundColor:'blue',color:'white', padding:'20px 0',textAlign:'center'}}> 
                  Random Images
                  </div>}
                {showSearchImages.length<1 && <Row> {showImg} </Row>}
                <div>
                <Row>{showSearchImages}</Row>
            </div>
            </Container>
        )
}

export default Home;
