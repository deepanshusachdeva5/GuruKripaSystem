const express = require('express')
const admin = require('../models/admin')
const Bill = require('../models/bill')
const Party = require('../models/party')
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const pdf = require('html-pdf');
const { ToWords } = require('to-words');



const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: { // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: '',
      },
    }
  }
});


adminRoutes = express.Router()



adminRoutes.post('/admin/create', async (req, res)=>{

    const name = req.query.name
    try{
        const newAdmin = new admin({name:name})
        await newAdmin.save() 
        res.send(newAdmin)
    }
    catch(e){
        console.log(e)
        res.status(500).send()
    }

})

adminRoutes.post('/admin/bill/create', async (req, res) =>{
    const products =req.body.products
    try{

        const newBill = new Bill({
                ...req.query,
                products:products
            })
        await newBill.save()
        res.send(newBill)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)
    }
})

adminRoutes.post('/admin/bill/delete', async (req, res)=>{
    
    const billNumber = req.query.billNumber
    try{
        const bill = await Bill.findOneAndDelete({billNumber : billNumber})
        if(!bill){
            return res.status(404).send()
        }
        res.send(bill)
    }
    catch(e){
        res.status(500).send(e)
    }
})

adminRoutes.get('/admin/bill/single_read', async (req, res)=>{
    const billNumber = req.query.billNumber
    const billTo = req.query.billTo

    try{
        let bill;
        if (billNumber){
            bill = await Bill.findOne({billNumber})
        }
        else if(billTo){
            bill = await Bill.find({billTo})
        }
        if(!bill){
            return res.status(404).send('Bill not found')    
        }
        res.send(bill)
    }
    catch(e){
        res.status(500).send()
    }
})

adminRoutes.get('/admin/bill/read_all', async (req, res)=>{
    try{
        const bills = await Bill.find()
        if(!bills){
            return res.status(404).send('Bill not found')    
        }
        res.send(bills)
    }
    catch(e){
        res.status(500).send()
    }
})


adminRoutes.get('/admin/bill/generate_bill', async (req, res) => {
  const billNumber = req.query.billNumber;

  try {
    // Fetch the bill from the database based on the bill number
    const bill = await Bill.findOne({ billNumber });
    if (!bill) {
      return res.status(404).send('Bill not found');
    }
    const htmlTemplate = fs.readFileSync('./billTemplate/invoice_order_receipt.html', 'utf-8');
    const template = handlebars.compile(htmlTemplate);

    const party = await Party.findOne({GST:bill.gstNo});
    
    let Grandtotal = 0;
    bill.products.forEach(item => {
        Grandtotal += (2*(item[0].cgst*item[0].price*item[0].quantity)/100) + (item[0].price*item[0].quantity)
    });
    const htmlContent = template({
      invoiceNumber: bill.billNumber,
      invoiceDate: bill.date,
      state: 'UP',
      billToParty: {
        name: party.Name,
        gstNo: party.GST,
        address: party.Address,
        state: party.state
      },
      shipToParty: {
        name: party.Name,
        gstNo: party.GST,
        address: party.Address,
        state: party.state
      },
      items: bill.products.map(item => ({
        name: item[0].prodName,
        hsnCode: item[0].hsn,
        itemType: item[0].uoc,
        price: item[0].price,
        quantity: item[0].quantity,
        taxableAmount: item[0].price*item[0].quantity,
        discount: 0,
        amountAfterDiscount: item[0].price*item[0].quantity,
        cgst: item[0].cgst,
        cgstAmount: ((item[0].cgst*item[0].price*item[0].quantity)/100).toFixed(2),
        sgst: item[0].sgst,
        sgstAmount: ((item[0].sgst*item[0].price*item[0].quantity)/100).toFixed(2),
        totalAmount: ((2*(item[0].cgst*item[0].price*item[0].quantity)/100) + (item[0].price*item[0].quantity)).toFixed(2)
      })),
      grandTotal: Grandtotal.toFixed(2),
      amountInWords:toWords.convert(Grandtotal.toFixed(2))
    });


    const options = {
      format: 'Letter',
      orientation: 'landscape'
    };

    const pdfPath = path.join(__dirname, '../../bill.pdf');
    const pdfFilename = `bill_${bill.billNumber}.pdf`;

    // Generate PDF from HTML content
    pdf.create(htmlContent, options).toFile(pdfPath, (err, result) => {
      if (err) {
        console.error('Error generating PDF:', err);
        return res.status(500).send('Failed to generate PDF');
      }
      console.log('PDF generated successfully:', result);

      // Set the response headers
      res.setHeader('Content-Disposition', `attachment; filename=${pdfFilename}`);
      res.setHeader('Content-Type', 'application/pdf');

      // Send the PDF file as the response
      res.download(pdfPath, pdfFilename, async (err) => {
        if (err) {
          console.error('Error downloading file:', err);
        } else {
          // Delete the temporary PDF file
          fs.unlinkSync(pdfPath);
          console.log('File downloaded and deleted:', pdfPath);
        }
      });
    });

    // Delete the temporary PDF file


    }catch (error) {
        console.error('Error generating Excel:', error);
        res.status(500).send('Failed to generate Excel');
    }
});



adminRoutes.get('/admin/bill/check_duplicate', async (req, res)=>{
        try{
            const bill = await Bill.findOne({billNumber:req.query.billNumber})
            if(bill){
                return res.send({exists:true})
            }
            return res.send({exists: false})
        }
        catch(e){
            res.status(500).send(e)    
        }
})

adminRoutes.post('/admin/party/create', async (req, res)=>{
        try{
            const party = await Party.findOne({GST:req.query.GST})
            if(party){
                return res.send({exists:true})
            }
            else{

                const newParty = new Party({
                        Name:req.query.Name,
                        GST: req.query.GST,
                        Address: req.query.Address,
                        State: req.query.State,
                    })
                await newParty.save()
                res.send(newParty) 
            }

        }
        catch(e){
            res.status(500).send(e)    
        }
})

adminRoutes.get('/admin/party/all', async (req, res)=>{
        try{
            const parties = await Party.find()
            res.send(parties) 

        }
        catch(e){
            res.status(500).send(e)    
        }
})

adminRoutes.get('/admin/party/find', async (req, res)=>{
        try{
            const party = await Party.findOne({GST:req.query.GST})
            if(!party){
                res.status(404).send("Party Not Found")
            }
            else{
                res.send(party) 
            }

        }
        catch(e){
            res.status(500).send(e)    
        }
})

module.exports = adminRoutes