const { sql } = require('../utils/economic_nl.sql');
const { databasePool } = require('../postgres.db');

const demoController = {};


demoController.getStatePolygon = async (req, res) => {
/*     await databasePool.query(sql.getStatePolygon)
    .then(poolRes => {
        res.json({
            response: poolRes.rows
        });
    })
    .catch(
		err => {
			console.log(err)
			res.status(400).send({ message: err.message })
			
		
		}
	)
	 */
	 
	 const { cvegeo_entidad } = req.body;
	 
	 console.log(cvegeo_entidad)
	
    try {
        const { rows } = await databasePool.query(sql.getStatePolygon(cvegeo_entidad));

        return res.status(200).send({
			state_name: rows[0]['entidad_nombre'],
            state_polygon: rows[0]['state_polygon']
        });
    } catch (error) {
		console.log(error)
        return res.status(400).send({ 
		    status: 'Error',
			error: error,
			message: error.message 
		
		});
    }		
	
}


demoController.searchFilter = async (req, res) => {
	const { filter, nivel } = req.body;
	console.log(filter)
	console.log(nivel)
	let querySQL = ''
	
	switch (nivel){
		case "ageb":
			querySQL = sql.searchFilterAgeb(filter)
			break;
		case "manzana":
			querySQL = sql.searchFilterManzana(filter)
			break;
		case "municipio":
			querySQL = sql.searchFilterMunicipio(filter)
			break;
	}

	
    try {
        const { rows } = await databasePool.query(querySQL);

        return res.status(200).send({
			result: rows
        });
    } catch (error) {
		console.log(error)
        return res.status(400).send({ 
		    status: 'Error',
			error: error,
			message: error.message 
		
		});
    }		
	
}

demoController.consultaDenue = async (req, res) => {
	const { cvegeo, nivel, wkt } = req.body;
	console.log(cvegeo)
	console.log(nivel)
	console.log(wkt)
	
/* 	switch (nivel){
		case "ageb":
			querySQL = sql.searchFilterAgeb(filter)
			break;
		case "manzana":
			querySQL = sql.searchFilterManzana(filter)
			break;
		case "municipio":
			querySQL = sql.searchFilterMunicipio(filter)
			break;
	}	 */
	
    try {
        const resultConsultaDenue = await databasePool.query(sql.consultaDenue(cvegeo, nivel, wkt));
		const resultCountCategories = await databasePool.query(sql.getCountCategoriesDenue(cvegeo, nivel, wkt));
		const resultCountSubcategories = await databasePool.query(sql.getCountSubcategoriesDenue(cvegeo, nivel, wkt));

        return res.status(200).send({
			result: resultConsultaDenue.rows,
			countCategories: resultCountCategories.rows,
			countSubcategories: resultCountSubcategories.rows,
			total: resultConsultaDenue.rowCount
        });
    } catch (error) {
		console.log(error)
        return res.status(400).send({ 
		    status: 'Error',
			error: error,
			message: error.message 
		
		});
    }		
	
}

demoController.getCensoEconomico = async(req, res) => {
	console.log("getCensoEconomico")
    const { municipio } = req.body;
    await Promise.all([
            databasePool.query(sql.ocupados_sectores(municipio)),
            databasePool.query(sql.ocupados_sexo(municipio)),
            databasePool.query(sql.remunerados_sexo(municipio)),
            databasePool.query(sql.produccionBruta_sectores(municipio)),
            databasePool.query(sql.productividadPromedio_sectores(municipio)),
            databasePool.query(sql.salarioMensual_sectores(municipio)),
            databasePool.query(sql.remunerados_sectores(municipio))
        ])
        .then(poolRes => {
            res.json({
                ocupados: {
                    sectores: poolRes[0].rows,
                },
                sexo: {
                    municipio: poolRes[1].rows[0],
                },
                remunerados: {
                    sectores: poolRes[6].rows,
                    municipio: poolRes[2].rows[0],
                },
                produccionBruta: {
                    sectores: poolRes[3].rows,
                },
                productividadLaboral: {
                    sectores: poolRes[4].rows,
                },
                salarioMensual: {
                    sectores: poolRes[5].rows,
                }
            });
        })
        .catch(err => {
				console.log(err)
				res.status(400).send({ message: err.message })
			}
		)
};


demoController.getSubcategoriesDenue = async(req, res) => {
	console.log("getSubcategoriesDenue")
	
    await Promise.all([
            databasePool.query(sql.subcategoriesDenue())
        ])
        .then(poolRes => {
            res.json({
                subcategoriesDenue: poolRes[0].rows,
            });
        })
        .catch(err => {
				console.log(err)
				res.status(400).send({ message: err.message })
			}
		)	
	

};


demoController.getHistoricalDenue = async(req, res) => {
	console.log("getSubcategoriesDenue")
	const { cvegeo, nivel, subsector, wkt } = req.body;
	console.log(cvegeo)
	console.log(nivel)
	console.log(wkt)	
	
    await Promise.all([
            databasePool.query(sql.historicalDenue(subsector, wkt, '2015')),
			databasePool.query(sql.historicalDenue(subsector, wkt, '2016')),
			databasePool.query(sql.historicalDenue(subsector, wkt, '2019')),
			databasePool.query(sql.historicalDenue(subsector, wkt, '2020')),
			databasePool.query(sql.historicalDenue(subsector, wkt, '2021')),
			databasePool.query(sql.historicalDenue(subsector, wkt, '2022'))
        ])
        .then(poolRes => {
            res.json({
                2015: poolRes[0].rows,
				2016: poolRes[1].rows,
				2019: poolRes[2].rows,
				2020: poolRes[3].rows,
				2021: poolRes[4].rows,
				2022: poolRes[5].rows,
            });
        })
        .catch(err => {
				console.log(err)
				res.status(400).send({ message: err.message })
			}
		)	
	

};


demoController.getColoniaFromAgeb = async(req, res) => {
	console.log("getColoniaFromAgeb")
	const { wkt } = req.body;
	console.log(wkt)	

    await Promise.all([
            databasePool.query(sql.getColoniaFromAgeb(wkt))
        ])
        .then(poolRes => {
            res.json({
                colonia: poolRes[0].rows,
            });
        })
        .catch(err => {
				console.log(err)
				res.status(400).send({ message: err.message })
			}
		)	
	
};

demoController.getManzanasFromAgeb = async(req, res) => {
	console.log("getManzanasFromAgeb")
	const { ageb_cve, wkt } = req.body;
	console.log(wkt)	

    await Promise.all([
            databasePool.query(sql.getManzanasFromAgeb(ageb_cve, wkt))
        ])
        .then(poolRes => {
            res.json({
                manzanas: poolRes[0].rows,
            });
        })
        .catch(err => {
				console.log(err)
				res.status(400).send({ message: err.message })
			}
		)	
	
};

demoController.getMunicipioFromAgeb = async(req, res) => {
	console.log("getMunicipioFromAgeb")
	const { municipio_cve } = req.body;
	console.log(municipio_cve)	

    await Promise.all([
            databasePool.query(sql.getMunicipioFromAgeb(municipio_cve))
        ])
        .then(poolRes => {
            res.json({
                municipio: poolRes[0].rows[0],
            });
        })
        .catch(err => {
				console.log(err)
				res.status(400).send({ message: err.message })
			}
		)	
};

module.exports = demoController;
