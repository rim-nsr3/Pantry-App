'use client'
import { Button, Stack, Typography, Modal, TextField, Avatar} from '@mui/material';
import Image from 'next/image';
import Box from '@mui/material/Box';
import { firestore } from '../firebase';
import { useEffect, useState } from 'react';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';


import IconButton from '@mui/material/IconButton';

import { query, collection, getDocs, setDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import image from "./pantry.webp"
const style = {
  position: 'absolute',
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
      pantryList.push({ name: doc.id, ...doc.data() })
    })
    console.log(pantryList)
    setPantry(pantryList)
  }
  useEffect(() => {

    updatePantry()
  }, [])


  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      await setDoc(docRef, { count: count + 1 })
    } else {
      await setDoc(docRef, { count: 1 })
    }
    await updatePantry()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { count } = docSnap.data()
      if (count > 1) {
        await setDoc(docRef, { count: count - 1 })
      } else {
        await deleteDoc(docRef)
      }
    }
    await updatePantry()
  }
  return (
    <Box
      width="100%"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <AppBar position="fixed" sx={{ bgcolor: '#fff' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#000000'}}>
            Pantry-Tracker
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#000000' }} textAlign={'right'}>
            Made with ❤️ by Rim
          </Typography>
        </Toolbar>
      </AppBar>
      <div className="hero">
        <div>
          <div className='intro'>
            <h1>
              Pantry Tracker
            </h1>
            <p>
              Keep track of your entire pantry in one place
            </p>
          </div>
          <div>
            <Image src={image} alt="A pantry with various items" id='image1' width={500}
              height={500} />
          </div>
        </div>
      </div>
      <Box border={'0px solid black'} className="main-stack">
        <Box width="800px" height="100px" bgcolor="skyblue" display={"flex"} justifyContent={"center"} alignItems={"center"} className="header">
          <Typography variant="h3" color={'black'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" spacing={2} overflow={'auto'}>
          {pantry.length !== 0 ? (
            pantry.map(({ name, count }) =>
              <Box key={name} minHeight="150px"
                display={"flex"} justifyContent={"space-between"} paddingX={2} alignItems={"center"}  >
                <Typography variant="h4" color={'black'} textAlign={'center'}>
                  {
                    name.charAt(0).toUpperCase() + name.slice(1)
                  }
                </Typography>
                <Avatar sx={{ bgcolor: '#706454' }} textAlign={'center'}>{count}</Avatar>
                <Button className='Add-btn' style={{ marginBottom: "0px", padding: ".5rem 2rem" }} onClick={() => removeItem(name)}>Remove Item</Button>
              </Box>
            )) :
            (<p style={{ fontSize: '25px', display: 'inline-block', margin: '4rem auto' }}>You have no items in your pantry!</p>)
          }


        </Stack>
      </Box>
      <Button onClick={handleOpen} className="Add-btn">Add</Button>
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
            <TextField id="standard-basic" label="Item" variant="standard" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <Button variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
