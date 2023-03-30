const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1: Get All the Notes using: GET "/api/notes/getuser". Login Required
router.get("/routes/notes/fetchallnotes", fetchuser, async (req, res) => {
  try {
    // console.log("fetching all notes");
    // console.log(req.user);
    // console.log(req);
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    // console.log(error.message);
    // console.log("cannot fetch notes");
    res.status(500).send("Internal server error");
  }
});

// ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login Required
router.post("/routes/notes/addnote", fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //if there are bad requests, return Bad request and errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      // console.log(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote". Login Required
router.put("/routes/notes/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    // Create a newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    // Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return req.status(404).send("Not found");
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login Required
router.delete("/routes/notes/deletenote/:id", fetchuser, async (req, res) => {
  
  try {
    // Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //Allow deletion only if user owns this Note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    // console.log(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
