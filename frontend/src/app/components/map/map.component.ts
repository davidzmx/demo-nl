import { Component, OnInit } from '@angular/core';

import * as L from "leaflet";
import { stringify } from 'wellknown/wellknown.js';
import gradstop from 'gradstop';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { NgxSpinnerService } from 'ngx-spinner';

//import { backend_url } from "../../../config/url.config";
//import { PolygonService } from '../../services/polygon.service';
import { DemoService } from '../../services/demo.service';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { NgTypeToSearchTemplateDirective } from '@ng-select/ng-select/ng-select/ng-templates.directive';
//import nl_manzana_nse from '../../../assets/nl_manzana_nse.json';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: [
    './map.component.css',
    './../css/cardWindows.css',
    './../css/charts.css'
  ]
})
export class MapComponent implements OnInit {
    
  public map;  
  public polygonLayer;
  public selected_level = "ageb";
  public selected_gender = "";
  public selected_age_range = "p_18a24";
  //public layerGroup;
  public lightTheme: boolean = true;  
  public resultFilter;
  public showResultFilter = false;

  public searched_polygons;
  public polygon_selected_name = 'Nuevo León';
  public polygon_selected_cvegeo = '';
  public polygon_selected_geojson = '';

  public polygon_colonia;
  public showColony = false;

  public polygon_municipio;
  public showMunicipio = false;  
  public currentMunicipioCve = ''; 
  public currentMunicipioNombre = ''; 
  public selectedMunicipioCve = ''; 

  public polygon_manzanas;
  public showManzanas = false;

  public layerGroupManzanas;


  /***variables para DENUE */
  public denue_points;
  public filteredDenuePoints;
  public layerGroupDenuePoints;
  public denue_array_geometries = [];
  public denueCategories;
  public denueCategoriesArray = [];
  public showDenue = false;
  public denueChart = undefined;
  public denueChartData = [];
  //public showSearcher = false;
  public numberOfDenueFeaturesFiltered = 0;
  public showSearchResult = false;

  public showHistoricalDenueChart = false;
  public denueHistoricalChart = undefined;
  public denueHistoricalChartData = [];


  public selectedSubsector;
  public selectedSubsector_name;
/*   public selectedSubsector = { //ejemplo: {subsector: "484", subsector_nombre: "Autotransporte de carga"}
    subsector:'', 
    subsector_nombre:''
  };  */
  public subsectorsDenue = [
    {subsector:'hola', subsector_nombre:"no se"},
    {subsector:'hola2', subsector_nombre:"no se2"},
    {subsector:'hola3', subsector_nombre:"no se3"}
  ]  

  /**** * variables para censo económico****/
  public showEconomiaChart = false;
  public economiaChartData = [];
  public economiaTableData = [];

  public econOcupadoTableData = []
  public econOcupadoSexoChartData = [];

  public econOcupadoLabel = '';
  public economiLabel = '';
  public econOcuSexLabel = '';

  public economiaRemuTableData = [];
  public econRemuLabel = '';

  public econRemuSexoChartData = [];
  public econRemuSexLabel = '';

  public econProduccionTableData = [];
  public econProductividadTableData = [];
  public econProdLabel = '';

  public econSalarioTableData = [];
  public econSalarioLabel = '';

  public selectedTypeCenso = 'ocupados';

  public showEconomiPie = false;
  public showEconomiTable = true;
  public showEconomiMoney = false;


  public economiaAmBar = undefined;
  public economiaBarChartTitle = {
    title: '',
    subtitle: ''
  };  

  public economiaAmchart = undefined;

  public economiaPieChartTitle = {
    title: '',
    subtitle: ''
  };  

  public economiaMoneyBar = undefined;
  public econMoneyValueAxis = undefined;

  //variables para mostrar/ocultar tabs
  public showFilterTab = true;

  public showPoblacionTab = true;
  public showNegociosTab = false;
  public showVulTab = false;  

  /****FIN variables para censo económico*** */

  public pobEA = {
    pea_hombres:this.numberWithCommas(1750498),
    pea_mujeres:this.numberWithCommas(1111505),
    pea_total:this.numberWithCommas(2862003)
  }

  public pobOcupada = {
    poc_hombres:this.numberWithCommas(1711371),
    poc_mujeres:this.numberWithCommas(1096078),
    poc_total:this.numberWithCommas(2807449)
  }  

  public pobData = {
    pobTotal: {
      title: 'Población total',
      type: 'poblacion',
      total: this.numberWithCommas(5784442),
      src: '',
      logo: 'fas fa-users',
      tooltip: 'Total de población'
    },
    man: {
      title: 'Hombres',
      type: 'poblacion',
      total: this.numberWithCommas(2890950),
      logo: 'fas fa-male',
      tooltip: 'Población masculina'
    },
    woman: {
      title: 'Mujeres',
      type: 'poblacion',
      total: this.numberWithCommas(2893492),
      logo: 'fas fa-female',
      tooltip: 'Población femenina'
    },

/*     pea: {
      title: 'Población económicamente activa',
      type: 'ventilators',
      total: this.numberWithCommas(2862003),
      src: '',
      logo: 'fas fa-users',
      tooltip: 'Población económicamente activa'
    },
    pea_man: {
      title: 'Población económicamente activa masculina',
      type: 'ventilators',
      total: this.numberWithCommas(1750498),
      logo: 'fas fa-male',
      tooltip: 'Población económicamente activa masculina'
    },
    pea_woman: {
      title: 'Población económicamente activa femenina',
      type: 'ventilators',
      total: this.numberWithCommas(1111505),
      logo: 'fas fa-female',
      tooltip: 'Población económicamente activa femenina'
    },    

    pocupada: {
      title: 'Población ocupada',
      type: 'beds',
      total: this.numberWithCommas(2807449),
      src: '',
      logo: 'fas fa-users',
      tooltip: 'Población económicamente activa'
    },
    pocupada_man: {
      title: 'Población ocupada masculina',
      type: 'beds',
      total: this.numberWithCommas(1711371),
      logo: 'fas fa-male',
      tooltip: 'Población ocupada masculina'
    },
    pocupada_woman: {
      title: 'Población ocupada femenina',
      type: 'beds',
      total: this.numberWithCommas(1096078),
      logo: 'fas fa-female',
      tooltip: 'Población ocupada femenina'
    },     */  

  };
  

  public casesLegend = [
    {
      label: 'Ingresos altos',
      color: '#2ba37c'
    },
    {
      label: 'Ingresos medio/altos',
      color: '#54b799'
    },
    {
      label: 'Ingresos medios',
      color: '#76ccb8'
    },
    {
      label: 'Ingresos medio/bajos',
      color: '#97e2d7'
    },
    {
      label: 'Ingresos bajos',
      color: '#b7f7f7'
    },
    {
      label: 'No definido',
      color: '#bbbec7'
    }
  ];  

 //++++++++++++++++

  
  constructor(
    private demoService: DemoService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
      console.log("onInit!") //-99.952870, 25.833053
      this.initMap();
      //this.buscar();
  }


  initMap() {
    let minZoomMap = 5;
    this.map = L.map('mapid', {
      center: [25.833053, -99.952870],
      zoom: 8,
      zoomControl: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
      {
        minZoom: minZoomMap,
        attribution: '&copy; <a href="https://carto.com/">Carto</a> ' +
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);


    this.drawInitPolygon();
    this.initDenue();
    this.initSubcategoriesDenue();

    this.layerGroupManzanas = new L.LayerGroup();  
    this.layerGroupManzanas.addTo(this.map);    

    this.layerGroupDenuePoints = new L.LayerGroup();  
    this.layerGroupDenuePoints.addTo(this.map);

    //nl_manzana_nse

/*     let manzana_nse = new L.geoJSON(nl_manzana_nse,{
    }).addTo(this.map); */

  }
  
  
  drawInitPolygon(){
    console.log("drawInitPolygon!!")
    let that = this;
    let entidad_cvegeo = '19' //19 = Nuevo Léon
    this.demoService.getStatePolygon(entidad_cvegeo).subscribe(data => {
        console.log(data)
        let polygonJSON = JSON.parse(data['state_polygon'])
        //let polygonJSON = data['state_polygon']
        console.log(polygonJSON)
        
        that.polygonLayer = L.geoJSON(polygonJSON).addTo(that.map);
        that.polygonLayer.options.zIndex = 1;

/*         that.polygonLayer = L.geoJSON(polygonJSON,{
          style:  {
            "color": "#ffffff",
            "weight": 0,
            "fillOpacity": 0.5
          } 

        }).addTo(that.map); */
        
        that.map.flyToBounds(that.polygonLayer.getBounds(), { paddingBottomRight: [0, 0] })
        this.buscar();
    });
  }
  
  initDenue() {
    this.denueCategoriesArray = [];
    this.denueCategories = new Map();
    this.denueCategories.set(' Apoyo a negocios y manejo de residuos', {
      counter: 0,
      employeeres: 0,
      color: '#0292b7',
      category: 'Apoyo a negocios y manejo de residuos',
    });

    this.denueCategories.set('Actividades legistalivas y gubernamentales', {
      counter: 0,
      employeeres: 0,
      color: '#1ac8db',
      category: 'Actividades legistalivas y gubernamentales',
    });

    this.denueCategories.set('Agricultura, ganadería y pesca', {
      counter: 0,
      employeeres: 0,
      color: '#8c756a',
      category: 'Agricultura, ganadería y pesca',
    });

    this.denueCategories.set('Alojamiento y alimentación', {
      counter: 0,
      employeeres: 0,
      color: '#dee2ec',
      category: 'Alojamiento y alimentación',
    });

    this.denueCategories.set('Comercio al por mayor', {
      counter: 0,
      employeeres: 0,
      color: '#fa26a0',
      category: 'Comercio al por mayor',
    });

    this.denueCategories.set('Comercio al por menor', {
      counter: 0,
      employeeres: 0,
      color: '#f51720',
      category: 'Comercio al por menor',
    });

    this.denueCategories.set('Construcción', {
      counter: 0,
      employeeres: 0,
      color: '#f8d210',
      category: 'Construcción',
    });

    this.denueCategories.set('Corporativos', {
      counter: 0,
      employeeres: 0,
      color: '#2ff3e0',
      category: 'Corporativos',
    });

    this.denueCategories.set('Industria manufacturera', {
      counter: 0,
      employeeres: 0,
      color: '#d8a7b1',
      category: 'Industria manufacturera',
    });

    this.denueCategories.set('Información en medios masivos', {
      counter: 0,
      employeeres: 0,
      color: '#b6e2d3',
      category: 'Información en medios masivos',
    });

    this.denueCategories.set('Minería', {
      counter: 0,
      employeeres: 0,
      color: '#fae8e0',
      category: 'Minería',
    });

    this.denueCategories.set('Otros servicios', {
      counter: 0,
      employeeres: 0,
      color: '#ef7c8e',
      category: 'Otros servicios',
    });

    this.denueCategories.set('Servicios de salud y asistencia social', {
      counter: 0,
      employeeres: 0,
      color: '#ffaebc',
      category: 'Servicios de salud y asistencia social',
    });

    this.denueCategories.set('Servicios educativos', {
      counter: 0,
      employeeres: 0,
      color: '#a0e7e5',
      category: 'Servicios educativos',
    });

    this.denueCategories.set('Servicios financieros y de seguros', {
      counter: 0,
      employeeres: 0,
      color: '#b4f8c8',
      category: 'Servicios financieros y de seguros',
    });

    this.denueCategories.set('Servicios inmobiliarios', {
      counter: 0,
      employeeres: 0,
      color: '#fbe7c6',
      category: 'Servicios inmobiliarios',
    });

    this.denueCategories.set('Servicios profesionales, científicos y técnicos', {
      counter: 0,
      employeeres: 0,
      color: '#81b622',
      category: 'Servicios profesionales, científicos y técnicos',
    });

    this.denueCategories.set('Servicios públicos', {
      counter: 0,
      employeeres: 0,
      color: '#0000ff',
      category: 'Servicios públicos',
    });

    this.denueCategories.set('Servicios recreativos', {
      counter: 0,
      employeeres: 0,
      color: '#ecf87f',
      category: 'Servicios recreativos',
    });

    this.denueCategories.set('Transportes, correo y almacenamiento', {
      counter: 0,
      employeeres: 0,
      color: '#b68d40',
      category: 'Transportes, correo y almacenamiento',
    });
  }


  initSubcategoriesDenue(){
    let that = this;
    this.demoService.getSubcategoriesDenue().then(
      (data) => {
        console.log(data)
        that.subsectorsDenue = data["subcategoriesDenue"]

        //let censoEconomicoData = data;
        //this.initCensoEconomicoCharts(censoEconomicoData);
      },
      (error) => {
        //this.errorMessage();
        console.error('ERROR', error);
      });  

  }  

  getColorDenueCategory(id) {
    //console.log(id)
    //console.log(this.denueCategories)
    try{
      let data = this.denueCategories.get(id);
      return data.color;
    }
    catch{
      return '#000'
    }
  }  

  getColorNivelsocioeconomico(level) {
    console.log("LEVEL:",level)
    let color = ""
    switch(level){

      case 1:
        color="#b7f7f7";
        break;
      case 2:
        color="#97e2d7";
        break;
      case 3:
        color="#76ccb8";
        break;
      case 4:
        color="#54b799";
        break;
      case 5:
        color="#2ba37c";
        break; 
      case 0:
      default:
          color="#bbbec7";
          break;                                                               
    }
    return color

  }   
  
  getNivelSocioeconomico(level) {
    let nivel_socioeconomico = ""
    switch(level){

      case 1:
        nivel_socioeconomico="Ingresos bajos";
        break;
      case 2:
        nivel_socioeconomico="Ingresos medio/bajos";
        break;
      case 3:
        nivel_socioeconomico="Ingresos medios";
        break;
      case 4:
        nivel_socioeconomico="Ingresos medio/altos";
        break;
      case 5:
        nivel_socioeconomico="Ingresos altos";
        break; 
      case 0:
      default:
        nivel_socioeconomico="No definido";
          break;                                                               
    }
    return nivel_socioeconomico

  }  

  changeTab(tab) {
    switch (tab) {
      case 'poblacion':
        this.showPoblacionTab = true;
        this.showNegociosTab = false;
        this.showVulTab = false;
        //this.projectionChart.reinit();
        break;
      case 'negocios':
        this.showPoblacionTab = false;
        this.showNegociosTab = true;
        this.showVulTab = false;
        //this.covidAgesChart.reinit();
        break;
/*       case 'vul':
        this.showInfraTab = false;
        this.showCovidTab = false;
        this.showVulTab = true;
        this.povertyChart.reinit();
        if (this.mortalityRateChart !== undefined) {
          this.mortalityRateChart.reinit();
        }
        break;
      case 'pop':
        this.showTwitterTab = false;
        this.showWMSTab = false;
        this.showPopTab = true;
        break;
      case 'twitter':
        this.showTwitterTab = true;
        this.showWMSTab = false;
        this.showPopTab = false;
        break;
      case 'wms':
        this.showTwitterTab = false;
        this.showWMSTab = true;
        this.showPopTab = false;
        break; */
    }
  }  

  getNivel(selectedValue) {
    console.log("getNivel");
    console.log(selectedValue);
    this.selected_level = selectedValue;
  }

  selectAgeRange(selectedValue){
    console.log("selectAgeRange");
    this.selected_age_range = selectedValue;
    this.buscar();
  }

  selectGender(selectedValue) {
    console.log("selectGender");
    console.log(selectedValue);
    switch (selectedValue){
      case 'hombres':
        this.selected_gender = '_m';
        break;
      case 'mujeres':
        this.selected_gender = '_f';
        break;   
      case 'ambos':
      default:
        this.selected_gender = '';
        break;               
    }
    console.log(this.selected_gender );
    this.buscar();
  } 
  
  buscar(){
    this.spinner.show();
    console.log("buscar!")
    this.showDenue = false;
    //this.polygon_selected_name=''
    this.showResultFilter=false;

    this.onSelectSubsector(undefined)
    if(this.map.hasLayer(this.searched_polygons)){
      this.map.removeLayer(this.searched_polygons)
    }
    if(this.map.hasLayer(this.denue_points)){
      this.map.removeLayer(this.denue_points)
    }    
    if(this.map.hasLayer(this.filteredDenuePoints)){
      this.map.removeLayer(this.filteredDenuePoints)
    }       
    if(this.map.hasLayer(this.polygon_colonia)){
      this.map.removeLayer(this.polygon_colonia)
      this.showColony=false
    }  
    if(this.map.hasLayer(this.polygon_manzanas)){
      this.map.removeLayer(this.polygon_manzanas)
      this.showManzanas=false
    }         
    if(this.map.hasLayer(this.polygon_municipio)){
      this.map.removeLayer(this.polygon_municipio)
      this.showMunicipio=false
    }            

    
    //this.selectedSubsector = null;

    let polygon_style = {
      "color": "#6C3721",
      "fillColor": "#e36930",
      "opacity": 0.50,
      "weight": 1
    };    
    
    let that=this;
    let filter = this.selected_age_range+this.selected_gender
    console.log(filter)
    this.demoService.searchInfo(filter, this.selected_level).subscribe(data => {
      console.log(data)

      let polygon_array = []
      console.log(data["result"].length)
      let num_min = data["result"][data["result"].length-1][filter]
      let num_max = data["result"][0][filter]
      console.log(num_max)
      console.log(num_min)

      data["result"].forEach(element => {
        //console.log(element)

        let polygonElement = JSON.parse(element['json_polygon'])
        //console.log(polygonElement)

        let newPolygon = {
          "type": "Feature",
          "properties": {
            "nombre": element['nombre'],
            "cvegeo": element['cvegeo'],
            "municipio_cvegeo": element['municipio_cvegeo'],
            "value": element[filter],
            "pob_total": element['pobtot'],
            "pob_hombres": element['pobmas'],
            "pob_mujeres": element['pobfem'],
            "pea": element['pea'],
            "pea_hombres": element['pea_m'],
            "pea_mujeres": element['pea_f'],    
            "pocupada": element['pea'],
            "pocupada_hombres": element['pocupada_m'],
            "pocupada_mujeres": element['pocupada_f'],                      
          },
          "geometry": polygonElement
        }
        polygon_array.push(newPolygon);
      });

      that.searched_polygons = new L.geoJSON(polygon_array,{
        style: polygon_style,
        onEachFeature: function (feature, layer) {
          layer.options.zIndex = 99;
          layer.bindTooltip(function (layer) {
            return layer.feature.properties.nombre+": "+that.numberWithCommas(parseInt(layer.feature.properties.value)); //merely sets the tooltip text
            }, {
            permanent: false,
            sticky:true
          });
          layer.setStyle({
            "color": "#6C3721",
            'fillColor': that.getColor(parseInt(layer.feature.properties.value),num_min,num_max),
            "opacity": 0.5,
            "fillOpacity": 0.6,
            "weight": 1
          });  
          layer.on('click', (e) => {
              that.spinner.show();
              that.map.flyToBounds(layer.getBounds(), { padding: [0, 0]})
              //that.map.flyToBounds(layer.getBounds(), { padding: [0, 0], maxZoom: 12 })
              that.polygon_selected_name = layer.feature.properties.nombre;
              that.polygon_selected_cvegeo = layer.feature.properties.cvegeo;
              that.polygon_selected_geojson = layer.feature;
              that.currentMunicipioCve = layer.feature.properties.municipio_cvegeo;

              that.pobData.pobTotal.total = that.numberWithCommas(layer.feature.properties.pob_total);
              that.pobData.man.total=that.numberWithCommas(layer.feature.properties.pob_hombres);
              that.pobData.woman.total=that.numberWithCommas(layer.feature.properties.pob_mujeres);
              
              that.pobEA.pea_total = that.numberWithCommas(layer.feature.properties.pea);
              that.pobEA.pea_hombres=that.numberWithCommas(layer.feature.properties.pea_hombres);
              that.pobEA.pea_mujeres=that.numberWithCommas(layer.feature.properties.pea_mujeres);    
              
              that.pobOcupada.poc_total = that.numberWithCommas(layer.feature.properties.pocupada);
              that.pobOcupada.poc_hombres=that.numberWithCommas(layer.feature.properties.pocupada_hombres);
              that.pobOcupada.poc_mujeres=that.numberWithCommas(layer.feature.properties.pocupada_mujeres);               
              
              that.resultFilter = that.numberWithCommas(parseInt(layer.feature.properties.value));
              that.showResultFilter = true;
              that.onSelectSubsector(undefined)
              //that.selectedSubsector = null;
              that.map.once('moveend', function (e) {
                //that.consultaDenue(that.polygon_selected_cvegeo);
                if(that.selected_level == 'municipio'){
                  that.getCensoEconomico();
                }
                else{
                  that.showEconomiaChart=false;
                  that.consultaDenue(that.polygon_selected_cvegeo);
                  that.getColoniaFromAgeb();
                  that.getManzanasFromAgeb();
                  that.getMunicipioFromAgeb();
                }
                
              });

              

          });          
          


        }

      }).addTo(that.map);
      //that.searched_polygons.bringToFront(); 

      this.map.flyToBounds(this.searched_polygons.getBounds())

      //this.layerGroup.addLayer(that.searched_polygons);
      //this.layerGroup.bringToFront(); 
      this.spinner.hide();
  });
  //this.spinner.hide();
  }

  consultaDenue(cvegeo){
    this.spinner.show();
    console.log("consultaDenue, "+cvegeo)
    console.log(this.polygon_selected_geojson)
    let wkt = stringify(this.polygon_selected_geojson);
    console.log(wkt)
    this.initDenue()
    this.showDenue = true;
    console.log(this.selected_level)
    let that = this;
    let cve='';
    switch (this.selected_level){
      case "ageb":
          cve = cvegeo.slice(9, 13);
        break;
      case "manzana":
          cve = cvegeo.slice(2, 5);
        break;
      case "municipio":
          cve = cvegeo.slice(2, 5);
        break;
    }


    
    if(this.map.hasLayer(this.denue_points)){
      this.map.removeLayer(this.denue_points)
    }
    if(this.map.hasLayer(this.filteredDenuePoints)){
      this.map.removeLayer(this.filteredDenuePoints)
    }      

    console.log(cve)
    this.denue_array_geometries = []
    this.demoService.consultaDenue(cve,that.selected_level, wkt).subscribe(data => {
      console.log(data)

      let countDenueTotal = parseInt(data["total"])

      that.denueChartData = [];

      data["result"].forEach(element => {
        let geomElement = JSON.parse(element['json_geometry'])
        //console.log(polygonElement)

        let newGeometry = {
          "type": "Feature",
          "properties": {
            "nombre": element['denue_nombre'],
            "actividad": element['actividad_nombre'],
            "sector": element['sector'],
            "sector_nombre": element['sector_nombre'],
            "subsector": element['subsector'],
            "subsector_nombre": element['subsector_nombre'],
          },
          "geometry": geomElement
        }
        that.denue_array_geometries.push(newGeometry);
      });

      that.denue_points = new L.geoJSON(that.denue_array_geometries,{
        onEachFeature: function (feature, layer) {
          layer.bindTooltip(function (layer) {
            return layer.feature.properties.nombre+" ("+layer.feature.properties.actividad+")"; //merely sets the tooltip text
            }, {
            permanent: false,
            sticky:true
          });          
        },


        pointToLayer : function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius : 4,
                fillColor : that.getColorDenueCategory(feature.properties.sector_nombre),
                //fillColor : "#ff7800",
                color : "#000",
                weight : 1,
                opacity : 1,
                fillOpacity : 1
            });
        }

      //}).addTo(that.map);
      }).addTo(that.layerGroupDenuePoints);


      data['countCategories'].forEach((category) => {
        let denueCategoryData = this.denueCategories.get(category['sector_nombre']);
        //console.log(category)
        //console.log(denueCategoryData)
        let childrenCategory = [];
        denueCategoryData.counter = category['count'];
        this.denueCategoriesArray.push({ nombre: category['sector_nombre'], count: parseInt(category['count']), color: denueCategoryData.color})
        this.denueCategories.set(category['sector_nombre'], denueCategoryData);

        let percentageColony = (category.count * 100 / countDenueTotal).toFixed(1);


        data["countSubcategories"].forEach((subcategory) => {
          if (subcategory.sector_nombre == category.sector_nombre) {
            let child = {
              name: subcategory.subsector_nombre,
              value: subcategory.count,
              percentages: {
                percentage: (subcategory.count * 100 / category.count).toFixed(2)
              }
            }
            childrenCategory.push(child);
          }
        });  // fin data["countSubcategories"].forEach((EconomicUnit)...

        that.denueChartData.push({
          name: category.sector_nombre,
          value: category.count,
          percentages: {
            //percentage: (category.count * 100 / countCategoryDenue).toFixed(2),
            percentageColony: (category.count * 100 / countDenueTotal).toFixed(1),
            categoryName: category.sector_nombre
          },
          color: denueCategoryData.color,
          children: childrenCategory
        });

      });   



      this.spinner.hide();
      console.log(this.denueCategoriesArray)
      this.showDenue = true;
      this.initChartColoniaDenue2('nombre');
    });
    /* this.initChartColoniaDenue2('nombre'); */
  }

  getCensoEconomico() {
    //this.spinner.show();
    console.log("getCensoEconomico") //solo se hace a nivel municipio
    let cvegeo = this.polygon_selected_cvegeo;
    let nombre = this.polygon_selected_name
    let nivel = this.selected_level;
    //let id_municipio = cvegeo.substring(2) + ' ' + nombre;
    //console.log(cvegeo,nombre,nivel,id_municipio)
    
    let id_municipio = this.currentMunicipioCve.substring(2) + ' ' + this.currentMunicipioNombre;
    console.log(id_municipio)

    this.demoService.getCensoEconomico([id_municipio]).then(
      (data) => {
        console.log(data)
        let censoEconomicoData = data;
        this.initCensoEconomicoCharts(censoEconomicoData);
      },
      (error) => {
        //this.errorMessage();
        console.error('ERROR', error);
      });    

  }

  
  getColor(num, min, max){
    let intervals = [];
    let opacity = 0.4
    let color = '#FFF700'
    //console.log(arrayCasos)

    let numIntervalsGradient = 12
    const gradient = gradstop({
      stops: numIntervalsGradient,
      inputFormat: 'hex',
      //colorArray: ['#EB3F0D', '#FF9E00', '#DCFF00', '#069933']
      colorArray: ['#FFFB00', '#FF1700']
    });

    let intervalsize = max / numIntervalsGradient
    //console.log(intervalsize)

    for (let i = 0; i < numIntervalsGradient; i++) {
      //let quantile = d3.quantile(arrayCasos, i / numIntervalsGradient);
      let quantile = intervalsize * (i + 1)
      let color = gradient[i];
      if (i == numIntervalsGradient - 1)
        quantile = max

      intervals.push([quantile, color]);
    }

    //console.log(intervals)  
    //console.log(numCasos)

    for (let i = 0; i < intervals.length; i++) {
      let intervalo = intervals[i];
      if (i == 0) {
        if (num <= intervalo[0]) {
          color = intervalo[1]
          break;
        }
      }
      else {
        if (num <= intervalo[0] && num > intervals[i - 1][0]) {
          color = intervalo[1]
          break;
        }

      }
    }


    return color
  }
  isNumber(val) { null; return typeof val === 'number'; }
  numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  toggleFlipCard(event, cardType) {
    let elementClass = event.target.className;
    let card;
    let canFlip = false;
    try {
      canFlip = elementClass.includes('can-flip');
    } catch (error) {
      canFlip = false;
    }
    if (canFlip) {
      switch (cardType) {
        case 'population':
          card = document.querySelector('#populationFlipCard');
          card.classList.toggle('is-flipped');
          break;
        case 'projection':
          card = document.querySelector('#projectionFlipCard');
          card.classList.toggle('is-flipped');
          break;
        case 'health':
          card = document.querySelector('#healthFlipCard');
          card.classList.toggle('is-flipped');
          break;
        case 'mortality':
          card = document.querySelector('#mortalityFlipCard');
          card.classList.toggle('is-flipped');
          break;
        case 'poverty':
          card = document.querySelector('#povertyFlipCard');
          card.classList.toggle('is-flipped');
          break;
      }
    }
  }  

  initChartColoniaDenue2(coloniaName) {
    console.log("initChartColoniaDenue2")

    if (this.denueChart != undefined) {
      this.denueChart.data = this.denueChartData;
      /* this.coloniaDenueChartTitle.text = coloniaName; */

      return;
    }

    am4core.useTheme(am4themes_animated);
    // Themes end

    // create chart
    this.denueChart = am4core.create("chartDenueDiv", am4charts.TreeMap);
    //this.denueChart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    this.denueChart.data = this.denueChartData;

    console.log(this.denueChartData)

    // only one level visible initially
    this.denueChart.maxLevels = 1;

    // define data fields
    this.denueChart.dataFields.value = "value";
    this.denueChart.dataFields.name = "name";
    //this.colonyDenueChart.dummyData = "percentages";
    this.denueChart.dataFields.children = "children";
    this.denueChart.dataFields.color = "color";

    //level1
    var level1 = this.denueChart.seriesTemplates.create("0");
    var level1_column = level1.columns.template;
    //    level1_column.fillOpacity = 0.8;
    level1_column.stroke = am4core.color("#fff");
    level1_column.strokeWidth = 2;
    //  level1_column.strokeOpacity = 0.5;
    level1_column.propertyFields.dummyData = "percentages";
    //level1.tooltip.pointerOrientation = 'down';
    //level1.tooltipText = "{name}";
/*     if (coloniaName == 'VALLEJO')
      level1_column.tooltipText = "{name}: [bold]{value} ({dummyData.percentageColony}%)[/] ";
    else
      level1_column.tooltipText = "{name}: [bold]{value}[/] \n % repecto a Azcapotzalco: [bold]{dummyData.percentage}%[/] \n % respecto a la colonia: [bold]{dummyData.percentageColony}%[/]";
    //level1.tooltip.disabled = true; */
    level1.tooltip.label.maxWidth = 400;
    level1.tooltip.label.wrap = true;
    let bullet1 = level1.bullets.push(new am4charts.LabelBullet());
    bullet1.locationX = 0.5;
    bullet1.locationY = 0.5;

    bullet1.label.textAlign = 'middle';
    //bullet0.label.text = "{name}: {value}";
    bullet1.label.text = "{name}";
    //bullet1.label.fill = am4core.color("#ffffff");
    bullet1.fontSize = 12;

    //level2
    var level2 = this.denueChart.seriesTemplates.create("1");
    level2.tooltip.label.maxWidth = 400;
    level2.tooltip.label.wrap = true;

    var level2_column = level2.columns.template;
    level2_column.propertyFields.dummyData = "percentages";
    /* level2_column.tooltipText = "{name} : [bold]{value} ({dummyData.percentage}%)[/] "; */
    let bullet2 = level2.bullets.push(new am4charts.LabelBullet());
    bullet2.locationX = 0.5;
    bullet2.locationY = 0.5;

    bullet2.label.textAlign = 'middle';
    bullet2.label.text = "{name}";
    //bullet2.label.fill = am4core.color("#ffffff");
    bullet2.fontSize = 12;

    //this.colonyDenueChart.layoutAlgorithm = this.colonyDenueChart.slice;   
    
    //this.showSearcher = true;

  }



  initCensoEconomicoCharts(censoEconomicoData) {
    console.log("initCensoEconomicoCharts")
    let ocupados = censoEconomicoData['ocupados'];

    this.economiaChartData = [];
    this.economiaTableData = [];

    let ocupadosTotal = 0;
    this.econOcupadoTableData = [];
    let ocupadosTotalTodos = 0;

    this.econOcupadoSexoChartData = [];

    ocupados['sectores'].forEach((sector) => {
      if (sector.total > 0) {
        let sectorSlices = sector.actividad_economica.split(' ');
        let sectorNumber = sectorSlices[1];

        let sectorName = sectorSlices.slice(2).join(' ').trim();

        let data = {
          title: sectorNumber,
          count: sector.total,
          name: sectorName
        };

        ocupadosTotal += parseFloat(sector.total);

        this.econOcupadoTableData.push(data);

        let sexData = {
          category: sectorNumber,
          name: sectorName,
          value1: sector.mujeres,
          value2: sector.hombres
        };

        this.econOcupadoSexoChartData.push(sexData);
      }

      ocupadosTotalTodos += parseFloat(sector.total);
    });

    this.economiaTableData = this.econOcupadoTableData;

    /* let ocupadosPercentage = (ocupadosTotal * 100) / parseFloat(ocupados['cdmx'].total); */

    this.econOcupadoLabel = `Total de ocupados en el municipio: ${String(ocupadosTotalTodos).replace(/(.)(?=(\d{3})+$)/g, '$1,')}`;
    if (this.showEconomiTable) {
      this.economiLabel = this.econOcupadoLabel;
    }

    this.initEconomiaBar();

    let ocupadosPorSexo = censoEconomicoData['sexo'];

    this.economiaChartData = this.econOcupadoSexoChartData;

    this.econOcuSexLabel = `
            <div>
              <span>Total de mujeres ocupadas en el municipio: ${String(ocupadosPorSexo.municipio.mujeres).replace(/(.)(?=(\d{3})+$)/g, '$1,')}</span><br>
              <span>Total de hombres ocupados en el municipio: ${String(ocupadosPorSexo.municipio.hombres).replace(/(.)(?=(\d{3})+$)/g, '$1,')}</span>
            </div>
          `;

    this.initEconomiaChart();

    let remunerados = censoEconomicoData['remunerados'];

    let remuneradosTotal = 0;
    this.economiaRemuTableData = [];
    let remuneradosTotalTodos = 0;

    this.econRemuSexoChartData = [];

    remunerados['sectores'].forEach((sector) => {
      if (sector.suma > 0) {
        let sectorSlices = sector.actividad_economica.split(' ');
        let sectorNumber = sectorSlices[1];

        let sectorName = sectorSlices.slice(2).join(' ').trim();

        let data = {
          title: sectorNumber,
          count: sector.suma,
          name: sectorName
        };

        remuneradosTotal += parseFloat(sector.suma);

        this.economiaRemuTableData.push(data);

        let sexData = {
          category: sectorNumber,
          name: sectorName,
          value1: sector.mujeres,
          value2: sector.hombres
        };

        this.econRemuSexoChartData.push(sexData);
      }

      remuneradosTotalTodos += parseFloat(sector.suma);
    });

    this.econRemuLabel = `Remunerados totales en el municipio: ${String(remuneradosTotalTodos).replace(/(.)(?=(\d{3})+$)/g, '$1,')}`;

    this.econRemuSexLabel = `
            <div>
              <span>Total de mujeres remuneradas en el municipio: ${String(remunerados.municipio.mujeres).replace(/(.)(?=(\d{3})+$)/g, '$1,')}</span><br>
              <span>Total de hombres remunerados en el municipio: ${String(remunerados.municipio.hombres).replace(/(.)(?=(\d{3})+$)/g, '$1,')}</span>
            </div>
          `;

    let produccionBruta = censoEconomicoData['produccionBruta'];

    let produccionTotal = 0;
    this.econProduccionTableData = [];
    produccionBruta['sectores'].forEach((sector) => {
      let sectorSlices = sector.actividad_economica.split(' ');
      let sectorNumber = sectorSlices[1];

      let sectorName = sectorSlices.slice(2).join(' ').trim();

      if (parseInt(sector.produccion) > 0) {
        let data = {
          title: sectorNumber,
          count: sector.produccion,
          name: sectorName
        };

        produccionTotal += parseFloat(sector.produccion);

        this.econProduccionTableData.push(data);
      }
    });

    /* let produccionPercentage = (produccionTotal * 100) / parseFloat(produccionBruta['cdmx'].produccion); */

    let splitProduccion = (produccionTotal.toFixed(2) + "").split(".");

    this.econProdLabel = `Producción bruta total: $${String(splitProduccion[0]).replace(/(.)(?=(\d{3})+$)/g, '$1,')}.${splitProduccion[1]}`;

    this.initEconomiaMoneyBar();

    let productividadLaboral = censoEconomicoData['productividadLaboral'];

    let productividadTotal = 0;
    this.econProductividadTableData = [];
    productividadLaboral['sectores'].forEach((sector) => {
      let sectorSlices = sector.actividad_economica.split(' ');
      let sectorNumber = sectorSlices[1];

      let sectorName = sectorSlices.slice(2).join(' ').trim();

      if (sector.promedio > 0) {
        let data = {
          title: sectorNumber,
          count: sector.promedio * 1000000,
          name: sectorName
        };

        productividadTotal += parseFloat(sector.promedio);

        this.econProductividadTableData.push(data);
      }
    });

    let productividadPromedio = productividadTotal / productividadLaboral['sectores'].length;

    /* let productividadPercentage = (productividadPromedio * 100) / parseFloat(productividadLaboral['cdmx'].promedio); */

    /* this.azcaProductividadLabel = `Productividad laboral promedio con respecto al total en la CDMX: ${productividadPercentage.toFixed(2)}%` */

    let salarios = censoEconomicoData['salarioMensual'];

    let salariosTotal = 0;
    this.econSalarioTableData = [];
    salarios['sectores'].forEach((sector) => {
      let sectorSlices = sector.actividad_economica.split(' ');
      let sectorNumber = sectorSlices[1];

      let sectorName = sectorSlices.slice(2).join(' ').trim();

      if (sector.promedio > 0) {
        let data = {
          title: sectorNumber,
          count: sector.promedio,
          name: sectorName
        };

        salariosTotal += parseFloat(sector.promedio);

        this.econSalarioTableData.push(data);
      }
    });

    let salarioPromedio = salariosTotal / salarios['sectores'].length;

    /* let salarioPercentage = (salarioPromedio * 100) / parseFloat(salarios['cdmx'].promedio); */
    let splitSalario = (salarioPromedio.toFixed(2) + "").split(".");

    this.econSalarioLabel = `En promedio un trabajador gana $${String(splitSalario[0]).replace(/(.)(?=(\d{3})+$)/g, '$1,')}.${splitSalario[1]} pesos mensualmente en el municipio.`;

    //this.showEconomiaChart = true;
    this.changeEconomiChart(this.selectedTypeCenso);
    //this.spinner.hide();
  }


  initEconomiaBar() {
    if (this.economiaAmBar != undefined) {
      this.economiaAmBar.data = this.economiaTableData;
      return;
    }
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    this.economiaAmBar = am4core.create("economiaBarDiv", am4charts.XYChart);

    this.economiaAmBar.data = this.economiaTableData;

    this.economiaAmBar.bottomAxesContainer.layout = "horizontal";
    this.economiaAmBar.numberFormatter.numberFormat = "#,###";
    this.economiaAmBar.cursor = new am4charts.XYCursor();
    this.economiaAmBar.cursor.lineY.disabled = true;

    this.economiaBarChartTitle = {
      title: 'Población ocupada por sector económico',
      subtitle: 'Todas las personas que trabajaron dependiendo contractualmente o no de la unidad económica, sujetas a su dirección y control.'
    };

    // Create axes

    let categoryAxis = this.economiaAmBar.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.title.text = "Sector";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.cursorTooltipEnabled = false;

    let valueAxis = this.economiaAmBar.xAxes.push(new am4charts.ValueAxis());
    valueAxis.marginRight = 30;

    let series = this.economiaAmBar.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "title";
    series.dataFields.valueX = "count";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.tooltipText = "Sector {categoryY}: [bold]{valueX}[/]\n{name}";
    series.columns.template.fillOpacity = .8;
    series.tooltip.label.wrap = true;
    series.tooltip.label.maxWidth = 300;

    categoryAxis.sortBySeries = series;

    series.columns.template.adapter.add("fill", (fill, target) => {
      return this.economiaAmBar.colors.getIndex(target.dataItem.index);
    });

    if (this.lightTheme) {
      categoryAxis.title.fill = am4core.color("black");
      categoryAxis.renderer.labels.template.fill = am4core.color("black");
      valueAxis.renderer.labels.template.fill = am4core.color("black");
    } else {
      categoryAxis.title.fill = am4core.color("white");
      categoryAxis.renderer.labels.template.fill = am4core.color("white");
      valueAxis.renderer.labels.template.fill = am4core.color("white");
    }
  }

  initEconomiaChart() {
    if (this.economiaAmchart != undefined) {
      this.economiaAmchart.data = this.economiaChartData;
      return;
    }
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    this.economiaAmchart = am4core.create("economiaChartDiv", am4charts.XYChart);
    this.economiaAmchart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    this.economiaAmchart.data = this.economiaChartData;

    this.economiaPieChartTitle = {
      title: 'Población ocupada por género por sector económico',
      subtitle: 'Todas las personas que trabajaron dependiendo contractualmente o no de la unidad económica, sujetas a su dirección y control.'
    };

    this.economiaAmchart.colors.step = 2;
    this.economiaAmchart.padding(30, 30, 10, 30);
    this.economiaAmchart.legend = new am4charts.Legend();
    this.economiaAmchart.legend.fontSize = 12;

    var categoryAxis = this.economiaAmchart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.title.text = "Sector";
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.labels.template.rotation = -90;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";

    var valueAxis = this.economiaAmchart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;
    valueAxis.calculateTotals = true;
    valueAxis.renderer.minWidth = 50;

    var series1 = this.economiaAmchart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText = "Sector {categoryX}: [bold]{valueY.totalPercent.formatNumber('#.00')}%[/]\n{name}";
    series1.name = "Mujeres";
    series1.dataFields.categoryX = "category";
    series1.dataFields.valueY = "value1";
    series1.dataFields.valueYShow = "totalPercent";
    series1.dataItems.template.locations.categoryX = 0.5;
    series1.stacked = true;
    series1.tooltip.pointerOrientation = "vertical";
    series1.tooltip.label.wrap = true;
    series1.tooltip.label.maxWidth = 300;
    series1.columns.template.stroke = am4core.color("#845EC2");
    series1.columns.template.fill = am4core.color("#845EC2");

    var bullet1 = series1.bullets.push(new am4charts.LabelBullet());
    bullet1.interactionsEnabled = false;
    bullet1.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet1.label.fill = am4core.color("#ffffff");
    bullet1.locationY = 0.5;
    bullet1.label.fontSize = 10;

    bullet1.label.adapter.add("textOutput", function (text, target) {
      if (target.dataItem && target.dataItem.valueY == 0) {
        return "";
      }
      return text;
    });

    var series2 = this.economiaAmchart.series.push(new am4charts.ColumnSeries());
    series2.columns.template.width = am4core.percent(80);
    series2.columns.template.tooltipText = "Sector {categoryX}: [bold]{valueY.totalPercent.formatNumber('#.00')}%[/]\n{name}";
    series2.name = "Hombres";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.dataFields.valueYShow = "totalPercent";
    series2.dataItems.template.locations.categoryX = 0.5;
    series2.stacked = true;
    series2.tooltip.pointerOrientation = "vertical";
    series2.tooltip.label.wrap = true;
    series2.tooltip.label.maxWidth = 300;
    series2.columns.template.stroke = am4core.color("#FF6F91");
    series2.columns.template.fill = am4core.color("#FF6F91");

    var bullet2 = series2.bullets.push(new am4charts.LabelBullet());
    bullet2.interactionsEnabled = false;
    bullet2.label.text = "{valueY.totalPercent.formatNumber('#.00')}%";
    bullet2.locationY = 0.5;
    bullet2.label.fill = am4core.color("#ffffff");
    bullet2.label.fontSize = 10;

    bullet2.label.adapter.add("textOutput", function (text, target) {
      if (target.dataItem && target.dataItem.valueY == 0) {
        return "";
      }
      return text;
    });

    this.economiaAmchart.scrollbarX = new am4core.Scrollbar();

    if (this.lightTheme) {
      this.economiaAmchart.legend.labels.template.fill = am4core.color("black");
      this.economiaAmchart.legend.valueLabels.template.fill = am4core.color("black");
      categoryAxis.title.fill = am4core.color("black");
      categoryAxis.renderer.labels.template.fill = am4core.color("black");
      valueAxis.renderer.labels.template.fill = am4core.color("black");
    } else {
      this.economiaAmchart.legend.labels.template.fill = am4core.color("white");
      this.economiaAmchart.legend.valueLabels.template.fill = am4core.color("white");
      categoryAxis.title.fill = am4core.color("white");
      categoryAxis.renderer.labels.template.fill = am4core.color("white");
      valueAxis.renderer.labels.template.fill = am4core.color("white");
    }
  }

  initEconomiaMoneyBar() {
    if (this.economiaMoneyBar != undefined) {
      this.economiaMoneyBar.data = this.economiaTableData;
      return;
    }
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    this.economiaMoneyBar = am4core.create("economiaMoneyBarDiv", am4charts.XYChart);

    this.economiaMoneyBar.data = this.economiaTableData;

    this.economiaMoneyBar.bottomAxesContainer.layout = "horizontal";
    this.economiaMoneyBar.numberFormatter.numberFormat = "'$'#,###.##";
    this.economiaMoneyBar.cursor = new am4charts.XYCursor();
    this.economiaMoneyBar.cursor.lineY.disabled = true;

    // Create axes

    let categoryAxis = this.economiaMoneyBar.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.title.text = "Sector";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.minGridDistance = 1;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.disabled = true;
    categoryAxis.cursorTooltipEnabled = false;

    this.econMoneyValueAxis = this.economiaMoneyBar.xAxes.push(new am4charts.ValueAxis());
    this.econMoneyValueAxis.title.text = "Valor en Millones de pesos";
    this.econMoneyValueAxis.title.fontSize = 10;
    this.econMoneyValueAxis.marginRight = 30;

    let series = this.economiaMoneyBar.series.push(new am4charts.ColumnSeries());
    series.dataFields.categoryY = "title";
    series.dataFields.valueX = "count";
    series.columns.template.strokeOpacity = 0;
    series.columns.template.column.cornerRadiusBottomRight = 5;
    series.columns.template.column.cornerRadiusTopRight = 5;
    series.columns.template.tooltipText = "Sector {categoryY}: [bold]{valueX}[/]\n{name}";
    series.columns.template.fillOpacity = .8;
    series.tooltip.label.wrap = true;
    series.tooltip.label.maxWidth = 300;

    categoryAxis.sortBySeries = series;

    series.columns.template.adapter.add("fill", (fill, target) => {
      return this.economiaMoneyBar.colors.getIndex(target.dataItem.index);
    });

    if (this.lightTheme) {
      categoryAxis.title.fill = am4core.color("black");
      categoryAxis.renderer.labels.template.fill = am4core.color("black");
      this.econMoneyValueAxis.title.fill = am4core.color("black");
      this.econMoneyValueAxis.renderer.labels.template.fill = am4core.color("black");
    } else {
      categoryAxis.title.fill = am4core.color("white");
      categoryAxis.renderer.labels.template.fill = am4core.color("white");
      this.econMoneyValueAxis.title.fill = am4core.color("white");
      this.econMoneyValueAxis.renderer.labels.template.fill = am4core.color("white");
    }
  }


  changeEconomiChart(type) {
    this.selectedTypeCenso = type;
    let menuActive = document.getElementsByClassName('azcaActive');
    menuActive[0].classList.remove('azcaActive');

    if (type === 'ocupadoSexo') {
      this.economiaPieChartTitle.title = 'Población ocupada por género por sector económico';
      this.economiaPieChartTitle.subtitle = 'Todas las personas que trabajaron dependiendo contractualmente o no de la unidad económica, sujetas a su dirección y control.';
      this.economiaAmchart.data = this.econOcupadoSexoChartData;
      this.economiLabel = this.econOcuSexLabel;
      this.showEconomiPie = true;
      this.showEconomiTable = false;
      this.showEconomiMoney = false;

      document.getElementById('azcaMenuOcupadoSexo').classList.add('azcaActive');
    }
    if (type === 'ocupados') {
      this.economiaBarChartTitle.title = 'Población ocupada por sector económico';
      this.economiaBarChartTitle.subtitle = 'Todas las personas que trabajaron dependiendo contractualmente o no de la unidad económica, sujetas a su dirección y control.';
      this.economiaAmBar.data = this.economiaTableData;
      this.economiLabel = this.econOcupadoLabel;
      this.showEconomiPie = false;
      this.showEconomiTable = true;
      this.showEconomiMoney = false;

      document.getElementById('azcaMenuOcupado').classList.add('azcaActive');
    }
    if (type === 'remuneradoSexo') {
      this.economiaPieChartTitle.title = 'Población remunerada por género por sector económico';
      this.economiaPieChartTitle.subtitle = 'Todas las personas que trabajaron dependiendo contractualmente de la unidad económica, sujetas a su dirección y control, a cambio de una remuneración fija y periódica.';
      this.economiaAmchart.data = this.econRemuSexoChartData;
      this.economiLabel = this.econRemuSexLabel;
      this.showEconomiPie = true;
      this.showEconomiTable = false;
      this.showEconomiMoney = false;

      document.getElementById('azcaMenuRemuneradoSexo').classList.add('azcaActive');
    }
    if (type === 'remunerados') {
      this.economiaBarChartTitle.title = 'Población remunerada por sector económico';
      this.economiaBarChartTitle.subtitle = 'Todas las personas que trabajaron dependiendo contractualmente de la unidad económica, sujetas a su dirección y control, a cambio de una remuneración fija y periódica.';
      this.economiaAmBar.data = this.economiaRemuTableData;
      this.economiLabel = this.econRemuLabel;
      this.showEconomiPie = false;
      this.showEconomiTable = true;
      this.showEconomiMoney = false;

      document.getElementById('azcaMenuRemunerado').classList.add('azcaActive');
    }
    if (type === 'produccion') {
      this.economiaBarChartTitle.title = 'Producción bruta por sector económico';
      this.economiaBarChartTitle.subtitle = 'Es el valor de todos los bienes y servicios producidos o comercializados por los establecimientos en el periodo de un año';
      this.economiaMoneyBar.data = this.econProduccionTableData;
      this.econMoneyValueAxis.title.text = 'Valor en Millones de pesos';
      this.economiLabel = this.econProdLabel;
      this.showEconomiPie = false;
      this.showEconomiTable = false;
      this.showEconomiMoney = true;

      document.getElementById('azcaMenuProduccion').classList.add('azcaActive');
    }
    if (type === 'productividad') {
      this.economiaBarChartTitle.title = 'Productividad laboral por sector económico';
      this.economiaBarChartTitle.subtitle = 'Es la cantidad promedio producida por cada persona ocupada, en el periodo de un año.';
      this.economiaMoneyBar.data = this.econProductividadTableData;
      this.econMoneyValueAxis.title.text = '';
      this.economiLabel = '';
      this.showEconomiPie = false;
      this.showEconomiTable = false;
      this.showEconomiMoney = true;

      document.getElementById('azcaMenuProductividad').classList.add('azcaActive');
    }
    if (type === 'salario') {
      this.economiaBarChartTitle.title = 'Salario promedio mensual por sector económico';
      this.economiaBarChartTitle.subtitle = '';
      this.economiaMoneyBar.data = this.econSalarioTableData;
      this.econMoneyValueAxis.title.text = '';
      this.economiLabel = this.econSalarioLabel;
      this.showEconomiPie = false;
      this.showEconomiTable = false;
      this.showEconomiMoney = true;

      document.getElementById('azcaMenuSalario').classList.add('azcaActive');
    }
  }


  onSelectSubsector(event) {
    console.log("onSelectSubsector")
    let that = this;
    console.log(this.selectedSubsector)
    console.log(event)
    


    //console.log(that.denue_array_geometries)
    that.filteredDenuePoints = new L.geoJSON(that.denue_array_geometries,{
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(function (layer) {
          return layer.feature.properties.nombre+" ("+layer.feature.properties.actividad+")"; //merely sets the tooltip text
          }, {
          permanent: false,
          sticky:true
        });          
      },
      pointToLayer : function(feature, latlng) {
          return L.circleMarker(latlng, {
              radius : 4,
              fillColor : that.getColorDenueCategory(feature.properties.sector_nombre),
              //fillColor : "#ff7800",
              color : "#000",
              weight : 1,
              opacity : 1,
              fillOpacity : 1
          });
      },
      filter: function(feature, layer) {								
        if(event != undefined)		
         return (feature.properties.subsector == event.subsector );
       else
         return true;
     },      

    //}).addTo(that.map);
    })

    that.layerGroupDenuePoints.clearLayers();
    that.layerGroupDenuePoints.addLayer(that.filteredDenuePoints);   
    this.numberOfDenueFeaturesFiltered = that.filteredDenuePoints.getLayers().length
    console.log("numberOfDenueFeaturesFiltered",this.numberOfDenueFeaturesFiltered)     

    if (event != undefined) {
      this.getHistoricalDenue();
      this.showSearchResult = true;     
      this.selectedSubsector_name = this.selectedSubsector["subsector_nombre"] 
    }    
    else{
      this.showSearchResult = false;
      this.selectedSubsector_name = ''
      this.showHistoricalDenueChart = false
      this.selectedSubsector = null;
    }

  }


  getHistoricalDenue(){
    console.log("getHistoricalDenue")
    let that = this;
    let wkt = stringify(this.polygon_selected_geojson);
    console.log(wkt)    
    this.demoService.getHistoricalDenue(this.polygon_selected_cvegeo, this.selected_level, wkt, this.selectedSubsector["subsector"]).then(
      (data) => {
        console.log(data)

        //let dataForGraph = []
        that.denueHistoricalChartData = [];

        for (const [key, value] of Object.entries(data)) {
          //console.log(`${key}: ${value}`);
          let yearInfo = {
            year: key,
            value: value.length
          }
          that.denueHistoricalChartData.push(yearInfo)
        }

        console.log(that.denueHistoricalChartData)

        console.log(data['2015'].length)
        console.log(data['2015'])
        console.log(data['2016'].length)
        console.log(data['2016'])
        console.log(data['2019'].length)
        console.log(data['2019'])   
        console.log(data['2020'].length)
        console.log(data['2020'])  
        console.log(data['2021'].length)
        console.log(data['2021'])  
        console.log(data['2022'].length)
        console.log(data['2022'])  
        
        that.initHistorialDenueChart()
                                    
      },
      (error) => {
        //this.errorMessage();
        console.error('ERROR', error);
      });  

  }

  initHistorialDenueChart(){
    console.log("initHistorialDenueChart")

    if (this.denueHistoricalChart != undefined) {
      this.denueHistoricalChart.data = this.denueHistoricalChartData;
      /* this.coloniaDenueChartTitle.text = coloniaName; */
      return;
    }

    am4core.useTheme(am4themes_animated);
    // Themes end

    // create chart
    this.denueHistoricalChart = am4core.create("chartHistoricoDenue", am4charts.XYChart);
    //this.denueChart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    // Export
    //this.denueHistoricalChart.exporting.menu = new am4core.ExportMenu();

    this.denueHistoricalChart.data = this.denueHistoricalChartData;

    //console.log(this.denueHistoricalChartData)   

    /* Create axes */
    var categoryAxis = this.denueHistoricalChart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.minGridDistance = 30;

    /* Create value axis */
    var valueAxis = this.denueHistoricalChart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
  
    /* Create series */
    var columnSeries = this.denueHistoricalChart.series.push(new am4charts.ColumnSeries());
    columnSeries.name = "Negocios";
    columnSeries.dataFields.valueY = "value";
    columnSeries.dataFields.categoryX = "year"; 
    
    columnSeries.columns.template.tooltipText = "[#fff font-size: 15px]{name} en {categoryX}:\n[/][#fff font-size: 20px]{valueY}[/] [#fff]{additional}[/]"
    columnSeries.columns.template.propertyFields.fillOpacity = "fillOpacity";
/*     columnSeries.columns.template.propertyFields.stroke = "stroke";
    columnSeries.columns.template.propertyFields.strokeWidth = "strokeWidth";
    columnSeries.columns.template.propertyFields.strokeDasharray = "columnDash"; */
    columnSeries.tooltip.label.textAlign = "middle";    


  }

  verHistoricoDenue(){
    console.log("verHistoricoDenue")
    this.showHistoricalDenueChart = true;
 
  }

  closeHistoricalDenue(){
    this.showHistoricalDenueChart = false;
  }

  verEconomiaChart(){
    this.showEconomiaChart = true;
  }  

  closeEconomiaChart(){
    this.showEconomiaChart = false;
  }  

  toggleShowColony(){
    console.log("toggleShowColony")
    this.showColony = !this.showColony;
    console.log(this.showColony)
    if(this.polygon_colonia != undefined){
      if(this.showColony == true){
        this.polygon_colonia.addTo(this.map)
        this.map.flyToBounds(this.polygon_colonia.getBounds(), { paddingBottomRight: [0, 0] })
      }
      else{
        this.map.removeLayer(this.polygon_colonia)
      }
    }
  }

  toggleShowManzanas(){
    console.log("toggleShowManzanas")
    this.showManzanas = !this.showManzanas;
    console.log(this.showManzanas)
    let hasDenuePoints=false
    let hasDenueFilteredPoints=false

    if(this.polygon_manzanas != undefined){
      if(this.showManzanas == true){
        if(this.map.hasLayer(this.denue_points)){ //para que los puntos del denue queden arriba de las manzanas se quitan y se vuelven a agregar
          hasDenuePoints=true
          this.map.removeLayer(this.denue_points)
        }    
        if(this.map.hasLayer(this.filteredDenuePoints)){
          hasDenueFilteredPoints =true
          this.map.removeLayer(this.filteredDenuePoints)
        }  

        this.polygon_manzanas.addTo(this.map)
        //this.polygon_manzanas.addTo(this.layerGroupManzanas)
        //this.map.flyToBounds(this.polygon_manzanas.getBounds(), { paddingBottomRight: [0, 0] })

        if(hasDenuePoints){   //para que los puntos del denue queden arriba de las manzanas se quitan y se vuelven a agregar
          this.denue_points.addTo(this.map)
        }
        if(hasDenueFilteredPoints){
          this.filteredDenuePoints.addTo(this.map)
        }

      }
      else{
        this.map.removeLayer(this.polygon_manzanas)
      }
    }
  }  

  toggleShowMunicipio(){
    console.log("toggleShowMunicipio")
    this.showMunicipio = !this.showMunicipio;
    
    console.log(this.showMunicipio)
    if(this.polygon_municipio != undefined){
      if(this.showMunicipio == true){
        this.polygon_municipio.addTo(this.map)
        this.map.flyToBounds(this.polygon_municipio.getBounds(), { paddingBottomRight: [0, 0] })
      }
      else{
        this.map.removeLayer(this.polygon_municipio)
      }
    }
    if(this.showMunicipio ==false){
      this.showEconomiaChart=false;
    }

  }  

  getColoniaFromAgeb(){
    console.log("getColoniaFromAgeb")
    if(this.map.hasLayer(this.polygon_colonia)){
      this.map.removeLayer(this.polygon_colonia)
      this.showColony=false
    }     
    let that = this;
    let wkt = stringify(this.polygon_selected_geojson);
    console.log(wkt)    
    this.demoService.getColoniaFromAgeb(wkt).then(
      (data) => {
        console.log(data) 

        let array_colonia = []
        data["colonia"].forEach(element => {

          let newGeometry = {
            "type": "Feature",
            "properties": {
              "colonia_nombre": element.colonia_nombre,
              "colonia_cve": element.colonia_cve,
              "colonia_tipo": element.colonia_tipo,
              "colonia_cp": element.colonia_cp,
            },
            "geometry": JSON.parse(element.geom_json)
          }   
          array_colonia.push(newGeometry)       

        });

        that.polygon_colonia = new L.geoJSON(array_colonia,{
          onEachFeature: function (feature, layer) {
            layer.options.zIndex = 1;
            layer.bindTooltip(function (layer) {
              return "Colonia: "+layer.feature.properties.colonia_nombre; //merely sets the tooltip text
              }, {
              permanent: false,
              sticky:false
            });
          }

        })//.addTo(that.map);
      },
      (error) => {
        //this.errorMessage();
        console.error('ERROR', error);
      });  
  }


  getManzanasFromAgeb(){
    console.log("getManzanasFromAgeb")
    if(this.map.hasLayer(this.polygon_manzanas)){
      this.map.removeLayer(this.polygon_manzanas)
      this.showManzanas=false
    }     
    let that = this;
    let wkt = stringify(this.polygon_selected_geojson);
    console.log(wkt)    
    this.demoService.getManzanasFromAgeb(this.polygon_selected_cvegeo,wkt).then(
      (data) => {
        console.log(data) 

        let array_manzanas = []
        data["manzanas"].forEach(element => {

          let newGeometry = {
            "type": "Feature",
            "properties": {
              "manzana_cve": element.cvegeo,
              "nse_score1": element.nse_score1,
              "nivel_socioeconomico": that.getNivelSocioeconomico(element.nse_score1)
            },
            "geometry": JSON.parse(element.geom_json)
          }   
          array_manzanas.push(newGeometry)       

        });

        that.polygon_manzanas = new L.geoJSON(array_manzanas,{
          onEachFeature: function (feature, layer) {
            layer.options.zIndex = 0;
            layer.setStyle({
              "color": "#000000",
              fillColor : that.getColorNivelsocioeconomico(feature.properties.nse_score1),
              "opacity": 1,
              "fillOpacity": 1,
              "weight": 1
            });             
            layer.bindTooltip(function (layer) {
              return "Manzana: "+layer.feature.properties.manzana_cve+". "+layer.feature.properties.nivel_socioeconomico; //merely sets the tooltip text
              }, {
              permanent: false,
              sticky:false
            });
          }

        })//.addTo(that.map);
      },
      (error) => {
        //this.errorMessage();
        console.error('ERROR', error);
      });  
  }

  getMunicipioFromAgeb(){
    console.log("getMunicipioFromAgeb")
    if(this.map.hasLayer(this.polygon_municipio)){
      this.map.removeLayer(this.polygon_municipio)
      this.showMunicipio=false
    }     
    let that = this;
    console.log(this.currentMunicipioCve)

/*     let wkt = stringify(this.polygon_selected_geojson);
    console.log(wkt)  */   
    this.demoService.getMunicipioFromAgeb(this.currentMunicipioCve).then(
      (data) => {
        console.log(data) 

        that.currentMunicipioNombre = data["municipio"]["municipio_nombre"]
        let featureMunicipio = {
            "type": "Feature",
            "properties": {
              "municipio_nombre": data["municipio"]["municipio_nombre"],
            },
            "geometry": JSON.parse(data["municipio"]["geom_json"])
          }            


        that.polygon_municipio =  new L.geoJSON(featureMunicipio,{
          onEachFeature: function (feature, layer) {
            layer.options.zIndex = 1;
            layer.setStyle({
              "color": "#6739b6",
              'fillColor': "#7f7fff",
              "opacity": 0.5,
              "fillOpacity": 0.6,
              "weight": 1
            });             
            layer.bindTooltip(function (layer) {
              return "Municipio: "+layer.feature.properties.municipio_nombre; //merely sets the tooltip text
              }, {
              permanent: false,
              sticky:false
            });
          }
        })//.addTo(that.map);

        that.getCensoEconomico();

/*         let array_colonia = []
        data["colonia"].forEach(element => {

          let newGeometry = {
            "type": "Feature",
            "properties": {
              "colonia_nombre": element.colonia_nombre,
              "colonia_cve": element.colonia_cve,
              "colonia_tipo": element.colonia_tipo,
              "colonia_cp": element.colonia_cp,
            },
            "geometry": JSON.parse(element.geom_json)
          }   
          array_colonia.push(newGeometry)       

        });

        that.polygon_colonia = new L.geoJSON(array_colonia,{
          onEachFeature: function (feature, layer) {
            layer.options.zIndex = 1;
            layer.bindTooltip(function (layer) {
              return "Colonia: "+layer.feature.properties.colonia_nombre; //merely sets the tooltip text
              }, {
              permanent: false,
              sticky:false
            });
          }

        })//.addTo(that.map); */
      },
      (error) => {
        //this.errorMessage();
        console.error('ERROR', error);
      });  
  }


}
