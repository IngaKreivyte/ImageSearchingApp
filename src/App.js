import React , {useState, useEffect}from 'react';
import {Container,Row, Col,Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

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
      
      setTagName(term)
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
          <Col xs={6} md={4} style={{marginTop:'10px'}} key= {i} > 
            <Image  src={image.urls.regular}  style={{margin:'0', padding:'0', width:'100%',height:250}} alt={image.alt_description} rounded  />
          </Col>
        )
      })
        const showImg=pictures.map((image,i)=>{
          return (
            <Col xs={6} md={4} style={{marginTop:'10px'}} key= {i} > 
              <Image src={image.urls.regular} style={{margin:'0', padding:'0', width:'100%',height:250}} alt={image.alt_description} rounded  />
            </Col>
          )
        })
        
        return (
            <Container fluid >
              <div style={{
                backgroundImage: "url(https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjk3Mzc5fQ)",
                backgroundPosition: 'center',
                repeat: 'no-repeat',
                backgroundSize: 'cover',
                color:'white',
                marginBottom:'20px',
                position:'relative',
                textAlign:'center', height:'200px'}} >
                <form  onSubmit={onFormSubmit}  style={{ position:'absolute', top:'30%', width:'100%'}}>
                  <label style={{ width:'100%'}}><h2 > Search Images </h2></label>
                  <input 
                    style={{width:'50%',
                      background:'transparent', 
                      border:' 1px solid white',
                      outline:'none',
                      borderRadius:"5px",
                      color:'white', 
                      padding:'5px'}}
                    type="text"
                    placeholder='Search free photos'
                    value={val}
                    onChange={onInputChange}
                  />
                  <button style={{position:'absolute', right:'26%',top:'64%',border:'none',borderRadius:'5px', background:'transparent', color:'white', userSelect:'none',outline:'none',}}> <FontAwesomeIcon icon={faSearch}/></button>
                </form>
                </div>
                <div>{key && key.filter((item,index,self)=>self.indexOf(item) === index).map((item,i)=>{
                  return <button style={{backgroundColor:'orange',color:'white',border:'none',userSelect:'none',borderRadius:'5px',margin:'5px', textAlign:'center'}} key={i} 
                  onClick={()=>{onSearchSubmit(item)}}>
                            {item} 
                        </button>
                })}
                </div>
                {images.length>0 &&
                  <div style={{backgroundColor:'blue',color:'white',padding:'20px 0', textAlign:'center'}}> 
                    Images related searches to “ {tagName}” 
                  </div>}
                {images.length<=0 &&
                  <div> <Row> {showImg} </Row></div>}
                <div>
                <Row>{showSearchImages}</Row>
            </div>
            {modal===true && 
            <React.Fragment>
            <div style={{width:'100%',height: '100vh',background: 'rgba(230, 222, 222, 0.4)',position: 'fixed',left: 0,top: 0, zIndex: 2}} 
              onClick={()=>{setModal(false)}}/>
            <div style={{position: 'fixed',left: '50%',top: '50%',borderRadius: '5px',transform:'translate(-50%,-50%)',padding: '20px 40px',
            textAlign: 'center',zIndex: 3, backgroundColor: 'white', width:'800px',height: '500px'}}> <div>{errors}</div><button>back</button></div>
            </React.Fragment>}
            </Container>
        )
}

export default Home;
