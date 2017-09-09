import React, { Component } from 'react';
import {
    Container
  , Header
  , Button
} from 'semantic-ui-react';
import {
    compose
  , lens
  , lensPath
  , view
  , over
  , set
} from 'ramda'

import DataGrid from './DataGrid';

import data from '../static/hg19.json';

const datasetsByID = data.datasets
const datasets = Object.values(datasetsByID)

const samplesByID = data.samples
const samples = Object.values(samplesByID)

/*
"MS000101.H3K27me3": {
  "analysis_attributes": {
    "alignment_software": "BWA", 
    "alignment_software_version": "0.6.1", 
    "analysis_group": "McGill EMC", 
    "analysis_software": "NA", 
    "analysis_software_version": "NA"
  }, 
  "browser": {
    "peak_calls": [
      {
        "big_data_url": "http://epigenomesportal.ca/public_data/release_6/McGill0001/MS000101.H3K27me3.peaks.bigBed", 
        "md5sum": "e4131e7fa275d2a71c905384bfddb513"
      }
    ], 
    "signal_unstranded": [
      {
        "big_data_url": "http://epigenomesportal.ca/public_data/release_6/McGill0001/MS000101.H3K27me3.signal.bigWig", 
        "md5sum": "927c20a4acbd898c71d964d79e592ff4"
      }
    ]
  }, 
  "experiment_attributes": {
    "chip_antibody": "anti-H3K27me3", 
    "chip_antibody_catalog": "MABI0323", 
    "chip_antibody_lot": "13001", 
    "chip_antibody_provider": "GeneTex", 
    "chip_protocol": "The fragmented chromatin samples are used for immunoprecipitations using the IP-Star (Diagenode) with validated histone antibodies. The immunoprecipitated chromatin pulldowns and inputs (without immunoprecipitation) are then reverse crosslinked, RNase treated, proteinase K treated and DNA recovered using silica-based purification columns (QIAgen). The purified samples are then quantified and profiled using the Agilent 2100 BioAnalyzer (Agilent Technologies). Libraries were prepared according to the Illumina TruSeq DNA protocols with adaptations for low amounts of material; changes includes PCR enrichment prior to Size Selection instead of after. The libraries get size selected between 200-400 bp using automated electrophoresis gels (SAGE Science). Completed libraries are checked on the Agilent 2100 BioAnalyzer (Agilent Technologies).", 
    "chip_protocol_antibody_amount": "2ug", 
    "chip_protocol_bead_amount": "80uL", 
    "chip_protocol_bead_type": "Protein A beads (Invitrogen)", 
    "chip_protocol_chromatin_amount": "2 million cells", 
    "chip_protocol_crosslink_time": "10 minutes", 
    "experiment_ontology_uri": "http://purl.obolibrary.org/obo/OBI_0001858", 
    "experiment_type": "Histone H3K27me3", 
    "extraction_protocol": "Samples are crosslinked with formaldehyde, quenched glycine and washed with PBS. The crosslinked samples are then sonicated using the waterbath-based Bioruptor (Diagenode) to create chromatin fragments containing 100-300 bp DNA fragments. The fragmented chromatin samples are then used for immunoprecipitations using the IP-Star (Diagenode) with validated histone antibodies. The immunoprecipitated chromatin pulldowns and inputs (without immunoprecipitation) are then reverse crosslinked, RNase treated, proteinase K treated and DNA recovered using silica-based purification columns (QIAgen). The purified samples are then quantified and profiled using the Agilent 2100 BioAnalyzer (Agilent Technologies).", 
    "extraction_protocol_sonication_cycles": "NA", 
    "extraction_protocol_type_of_sonicator": "Bioruptor (Diagenode)", 
    "library_generation_fragment_size_range": "200-400 bp", 
    "reference_registry_id": "IHECRE00000887.1"
  }, 
  "sample_id": "MS000101"
}, 
*/

const columnNames = [
    'sample_id'
  , 'chip_antibody'
  , 'chip_antibody_provider'
  , 'experiment_ontology_uri'
  , 'experiment_type'
  , 'reference_registry_id'
].map(s => ({ name: s }))

const columnLenses = [
    lensPath(['sample_id'])
  , lensPath(['experiment_attributes', 'chip_antibody'])
  , lensPath(['experiment_attributes', 'chip_antibody_provider'])
  , lensPath(['experiment_attributes', 'experiment_ontology_uri'])
  , lensPath(['experiment_attributes', 'experiment_type'])
  , lensPath(['experiment_attributes', 'reference_registry_id'])
]

const getCellValue = (rowIndex, columnIndex, data) =>
  view(columnLenses[columnIndex], data)



class App extends Component {
  constructor() {
    super()

    this.setCellValue = this.setCellValue.bind(this)

    this.state = {
      datasets: datasets
    }
  }

  setCellValue(rowIndex, columnIndex, newValue) {
    const { datasets } = this.state

    const lens =
      compose(lensPath([rowIndex]), columnLenses[columnIndex])

    this.setState({
      datasets: set(lens, newValue, datasets)
    })
  }

  render() {
    const {
      datasets
    } = this.state

    return (
      <div className="App">
        <Container>
          <Header as='h1'>TempOne</Header>

          <Button>Hide complete rows</Button>

          <br/>
          <br/>

          <DataGrid
            rows={datasets}
            columns={columnNames}
            getCellValue={getCellValue}
            setCellValue={this.setCellValue}
          />
        </Container>
      </div>
    );
  }
}

export default App;
