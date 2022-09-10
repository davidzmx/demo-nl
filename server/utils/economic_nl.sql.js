const sql = {}; 


sql.getStatePolygon = (cve_entidad) => {
	return {
		text: `
			SELECT entidad_nombre, ST_AsGeoJSON(entidad_geom_4326) state_polygon
			FROM nl.dim_entidad2020
			WHERE entidad_cvegeo=$1
        `,
		values: [cve_entidad]
	};
};

sql.searchFilterMunicipio = (filter) => {
	return {
		text: `
			select fmun.*,fmun.municipio_nombre as nombre,fmun.municipio_cvegeo as cvegeo, ST_AsGeoJSON(dmun.geom) json_polygon
			from nl.fact_municipio2020 fmun
			inner join  nl.dim_municipio2020 dmun on fmun.municipio_cvegeo = dmun.municipio_cvegeo
			order by fmun.`+filter+`::int desc
			limit 10
        `
	};
};


sql.searchFilterAgeb = (filter) => {
	return {
		text: `
			SELECT *,subquery.ageb_cvegeo as nombre,subquery.ageb_cvegeo as cvegeo 
			FROM (
				select fageb.*, ST_AsGeoJSON(dageb.ageb_urbana_geom_4326) json_polygon
				from nl.fact_ageb2020 fageb
				inner join  nl.dim_ageb_urbana2020 dageb on fageb.ageb_cvegeo = dageb.ageb_cvegeo
				where fageb.`+filter+` != 'N/D'
				and fageb.`+filter+` != '*'
				and nombre_localidad = 'Total AGEB urbana'
				order by fageb.`+filter+` desc
				limit 100
			) as subquery
			--order by subquery.`+filter+`::int desc
        `
	};
};


sql.searchFilterManzana = (filter) => {
	return {
		text: `
			select fageb.*, ST_AsGeoJSON(dmun.ageb_urbana_geom_4326) polygon
			from nl.fact_ageb2020 fageb
			inner join  nl.dim_ageb_urbana2020 dageb on fageb.ageb_cvegeo = dageb.ageb_cvegeo
			order by fageb.`+filter+`::int desc
			limit 10
        `
	};
};


sql.consultaDenue = (cvegeo, level, wkt) => {
	
	let cve_column = '';
    switch (level){
      case "ageb":
          cve_column = 'ageb'
        break;
      case "manzana":
          cve_column = 'manzana'
        break;
      case "municipio":
          cve_column = 'cve_mun'
        break;
    }
	
	return {
		text: `
			select denue_nombre,actividad_nombre, sector, sector_nombre, subsector, subsector_nombre, ST_AsGeoJSON(denue_geom_4326) json_geometry  
			from nl.dim_denue2022
			--where `+cve_column+` = $1
            WHERE ST_Intersects(
            	ST_GeomFromText($1, 4326),
                denue_geom_4326
            )			
			and sector_nombre is not null
			and subsector_nombre is not null
        `,
		values: [wkt]
	};
};

sql.getCountCategoriesDenue = (cvegeo, level, wkt) => {
	
	let cve_column = '';
    switch (level){
      case "ageb":
          cve_column = 'ageb'
        break;
      case "manzana":
          cve_column = 'manzana'
        break;
      case "municipio":
          cve_column = 'cve_mun'
        break;
    }
	
	return {
		text: `
			select sector_nombre, count(sector_nombre)
			from nl.dim_denue2022
			--where `+cve_column+` = $1
            WHERE ST_Intersects(
            	ST_GeomFromText($1, 4326),
                denue_geom_4326
            )				
			and sector_nombre is not null
			and subsector_nombre is not null			
			group by sector_nombre
			order by count(sector_nombre) desc
        `,
		values: [wkt]
	};
};


sql.getCountSubcategoriesDenue = (cvegeo, level, wkt) => {
	
	let cve_column = '';
    switch (level){
      case "ageb":
          cve_column = 'ageb'
        break;
      case "manzana":
          cve_column = 'manzana'
        break;
      case "municipio":
          cve_column = 'cve_mun'
        break;
    }
	
	return {
		text: `
			SELECT sector, sector_nombre, subsector, subsector_nombre, count(subsector_nombre)
			from nl.dim_denue2022
			--where `+cve_column+` = $1
            WHERE ST_Intersects(
            	ST_GeomFromText($1, 4326),
                denue_geom_4326
            )				
			and sector_nombre is not null
			and subsector_nombre is not null			
			group by sector, sector_nombre , subsector, subsector_nombre
        `,
		values: [wkt]
	};
};


sql.subcategoriesDenue = () => {
	
	return {
		text: `
			select distinct subsector, subsector_nombre
			from  nl.dim_denue2022
			where subsector_nombre is not null
			order by subsector_nombre
        `
	};
};


sql.historicalDenue = (subsector, wkt, year) => {
	
	return {
		text: `
			select denue_nombre,actividad_nombre, sector, sector_nombre, subsector, subsector_nombre, ST_AsGeoJSON(denue_geom_4326)  
			from nl.dim_denue`+year+`
			where subsector = $1
			and ST_Intersects(
            	ST_GeomFromText($2, 4326),
                denue_geom_4326
            )	 
        `,
		values: [subsector, wkt]
	};
};

//******* Censo Econímico *********
sql.ocupados_sectores = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';

    return {
        text: `SELECT
            actividad_economica,
            sum(h001a::int) as total,
            sum(h001b::int) as hombres,
            sum(h001c::int) as mujeres
          FROM
            nl.fact_censo_eco2018
          WHERE
            ${inSql}
          and ano_censal = '2018'
          and actividad_economica like 'Sector%'
          GROUP by(actividad_economica)
          ORDER by total desc`,
        values: []
    }
}

sql.ocupados_sexo = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';

    return {
        text: `SELECT
            sum(h001a::int) as total,
            sum(h001b::int) as hombres,
            sum(h001c::int) as mujeres
          FROM
            nl.fact_censo_eco2018
          WHERE
            ${inSql}
          and ano_censal = '2018'
          and actividad_economica like 'Sector%'`,
        values: []
    }
}

sql.remunerados_sexo = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';

    return {
        text: `SELECT
          sum(h010a::int) as total,
          sum(h010b::int) as hombres,
          sum(h010c::int) as mujeres
        FROM
          nl.fact_censo_eco2018
        WHERE
          ${inSql}
        and ano_censal = '2018'
        and actividad_economica like 'Sector%'`,
        values: []
    }
}

sql.produccionBruta_sectores = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';

    return {
        text: `SELECT
          actividad_economica,
          sum(a111a::numeric) as produccion
        FROM
          nl.fact_censo_eco2018
        WHERE
          ${inSql}
          and ano_censal = '2018'
          and actividad_economica like 'Sector%'
        GROUP by(actividad_economica)
        ORDER by produccion desc`,
        values: []
    }
}

sql.productividadPromedio_sectores = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';
    return {
        text: `SELECT
                actividad_economica,
                sum(a111a::numeric)/sum(h001a::int) as promedio
              FROM
                nl.fact_censo_eco2018
              WHERE
              ${inSql}
              and h001a::int > 0
              and ano_censal = '2018'
              and actividad_economica like 'Sector%'
              GROUP by(actividad_economica)`,
        values: []
    }
}

sql.salarioMensual_sectores = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';
    return {
        text: `SELECT
                actividad_economica,
                ((sum(J000A::float)*1000000)/sum(H010A::float))/12 as promedio
              FROM
                nl.fact_censo_eco2018
              WHERE
              ${inSql}
              and H010A::float > 0
              and ano_censal = '2018'
              and actividad_economica like 'Sector%'
              GROUP BY(actividad_economica)
              ORDER BY promedio`,
        values: []
    }
}

sql.remunerados_sectores = (municipio) => {
    let munJoin = `'${municipio.join("','")}'`;
    let inSql = 'municipio IN (';
    inSql += munJoin;
    inSql += ') ';
    return {
        text: `SELECT
                actividad_economica,
                sum(h010a::int) as suma,
                sum(h010b::int) as hombres,
                sum(h010c::int) as mujeres
              FROM 
                nl.fact_censo_eco2018
              WHERE
              ${inSql}
              and ano_censal = '2018'
              and actividad_economica LIKE 'Sector%'
              GROUP BY(actividad_economica)`,
        values: []
    }
}
//*********** FIN Censo Económico **************



module.exports = {
	sql
};
