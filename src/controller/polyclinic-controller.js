import polyclinicService from '../service/polyclinic-service.js';

const getAllPolyclinic = async (_req, res, next) => {
    try {
        const result = await polyclinicService.getAllPolyclinic();
        res.status(200).json({
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deletePolyclinic = async (req, res, next) => {
    try{
        const polyclinicId = req.params.polyclinicId;
        await polyclinicService.deletePolyclinic(polyclinicId);
        res.status(200).json({
            status: "OK",
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getAllPolyclinic,
    deletePolyclinic,
};