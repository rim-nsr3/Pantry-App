'use client'
import { Button, Stack, Typography, Modal, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import {firestore} from '../firebase';
import { useEffect, useState } from 'react';
import { query, collection, getDocs, setDoc, doc, deleteDoc, getDoc} from 'firebase/firestore';

const style = {
  position: 'absolute' , 
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 2
};
export default function Home() {
  const [pantry, setPantry] = useState([]) 
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('')
  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc) => {
      pantryList.push({name:doc.id, ...doc.data()})
    })
    console.log(pantryList)
    setPantry(pantryList)
  }
  useEffect(() => {
    
    updatePantry()
  }, [])


  const addItem = async(item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {count} = docSnap.data()
      await setDoc(docRef, {count:count+1})
    } else {
      await setDoc(docRef, {count:1})
    }
    await updatePantry()
  }

  const removeItem = async(item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const {count} = docSnap.data()
      if (count > 1) {
        await setDoc(docRef, {count:count-1})
      } else {
        await deleteDoc(docRef)
      }
    }
    await updatePantry()
  }
  return (
    <Box
      width="100vw" 
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Button variant="contained" onClick={handleOpen}>ADD</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add New Item
          </Typography>
          <Stack direction="row" spacing={2}>
            <TextField id="standard-basic" label="Item" variant="standard" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <Button variant="outlined" 
            onClick={() => {addItem(itemName) 
              setItemName('')
              handleClose()}}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box  border={'2px solid black'}>
        <Box width="800px" height="100px" bgcolor="skyblue" display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Typography variant="h3" color={'white'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px"  height="300px" spacing={2} overflow={'auto'}>
          {pantry.map(({name, count}) => 
            <Box key={name} minHeight="150px" 
            display={"flex"} justifyContent={"space-between"} paddingX={2} alignItems={"center"} bgcolor="lightpink" >

              <Typography variant="h4" color={'white'} textAlign={'center'}>

                {
                  //Capitalize the first letter of each word
                  name.charAt(0).toUpperCase() + name.slice(1)
                }
                
              
              </Typography>
              <Typography variant="h4" color={'white'} textAlign={'center'}>
                Quantity:{count}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>Remove Item</Button>
            </Box>
            
      )}


      </Stack>
      </Box>
    </Box>
  );
}