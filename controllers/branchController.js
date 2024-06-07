import Branch from "../models/branchModel.js";


//GET ALL BRANCH DETAILS
export const getAllBranches = async (req, res) => {
    try{
        const branches = await Branch.find();
        return res.send(branches);
    }
    catch (error) {
        console.log("Error fetching branches:", error);
        res.status(500).send("Failed to fetch branch details");
    }   
};


//GET A BRANCH DETAILS
export const getBranch = async (req, res) => {
  try{
      const id = req.params.id;
      const branch = await Branch.findById(id)
      res.send(branch);
  }
  catch (error) {
      console.log("Error fetching branch:", error);
      res.status(500).send("Failed to fetch branch details");
  } 
};


//CREATE BRANCH
export const createBranch = async (req, res) => {
    try {
        console.log("hitted");
        const body = req.body;
        console.log(body, "body");
  
        const { name,address,ph } = body;

        const createBranch = new Branch({
          name,
          address,
          ph
        });
             
        const newBranchCreated = await createBranch.save();
        if (!newBranchCreated) {
          return res.send("branch details are not added");
        }
        return res.send(newBranchCreated);     
    } 
    catch (error) {
      console.log("something went wrong", error);
      res.send("failed to add branch details");
    }
};


//UPDATE BRANCH DETAILS
export const updateBranch = async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      
      const {  name,address,ph } = body;
      const existingBranch = await Branch.findOne({ name, _id: id } );

      if (existingBranch) {
        return res.status(400).send("Branch name cannot be updated"); 
      }
      
        const updateData = {
        name,
        address,
        ph
      };
  
      const updateBranch = await Branch.findOneAndUpdate(
        { _id: id },
        updateData,
        {
          new: true,
        }
      );
  
      if (!updateBranch) {
        return res.status(404).send("Branch is not updated");
      }
      return res.status(200).send(updateBranch);
    } 
    catch (error) {
      console.log("Something went wrong", error);
      res.status(500).send("Failed to update branch details");
    }
};
  

//DELETE BRANCH DETAILS
export const deleteBranch = async (req, res) => {
    try{
        const id = req.params.id;
        const deleteId = await Car.deleteOne({ _id: id });
        if (!deleteId) {
          return res.send("not deleted"); 
        }
        res.send("deleted branch details");
    }
    catch (error) {
        console.log("something went wrong", error);
        res.send("failed to delete branch details");
    }   
};

