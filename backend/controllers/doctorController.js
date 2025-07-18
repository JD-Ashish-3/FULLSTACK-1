import doctorModel from "../models/doctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { availability: !docData.availability })
        res.json({ success: true, message: 'Availability changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }

}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']) //to get all doctors excluding their password and email
        res.json({ success: true, doctors })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API for doctor login

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }
        const isMatch = await bcrypt.compare(password, doctor.password) //true if both passwords are matching
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {
    try {
        const docId = req.docId
        const appointments = await appointmentModel.find({ docId })
        res.json({ success: true, appointments })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const docId = req.docId; // get from middleware
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && String(appointmentData.docId) === String(docId)) //Compare String(appointmentData.docId) === String(docId) to avoid ObjectId mismatch.
        {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment completed' })
        } else {
            return res.json({ success: false, message: 'Mark Failed' })

        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to cancel appointment completed for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const docId = req.docId; // get from middleware
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && String(appointmentData.docId) === String(docId)) //Compare String(appointmentData.docId) === String(docId) to avoid ObjectId mismatch.
        {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment cancelled' })
        } else {
            return res.json({ success: false, message: 'Cancelation Failed' })

        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const docId = req.docId
        const appointments = await appointmentModel.find({ docId })
        let earnings = 0
        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })
        let patients = []
        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })
        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5),
        }
        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}
//API to update doctor profile data from doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        const docId = req.docId
        const { fees, address, availability } = req.body
        await doctorModel.findByIdAndUpdate(docId, { fees, address, availability })
        res.json({ success: true, message: "Profile updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile }
