import React, { Component } from 'react';
import {
    Container
  , Header
  , Tab
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

const datasetColumns = [
    'sample_id'
  , 'chip_antibody'
  , 'chip_antibody_provider'
  , 'experiment_ontology_uri'
  , 'experiment_type'
  , 'reference_registry_id'
].map(s => ({ name: s }))

const datasetLenses = [
    lensPath(['sample_id'])
  , lensPath(['experiment_attributes', 'chip_antibody'])
  , lensPath(['experiment_attributes', 'chip_antibody_provider'])
  , lensPath(['experiment_attributes', 'experiment_ontology_uri'])
  , lensPath(['experiment_attributes', 'experiment_type'])
  , lensPath(['experiment_attributes', 'reference_registry_id'])
]

const getDatasetValue = (rowIndex, columnIndex, data) =>
  view(datasetLenses[columnIndex], data)


/*
    "MS048802": {
      "biomaterial_type": "Primary Cell", 
      "cell_type": "Monocyte", 
      "cell_type_ontology_uri": "http://purl.obolibrary.org/obo/CL_0000576", 
      "disease": "Rheumatoid Arthritis", 
      "disease_ontology_uri": "http://ncit.nci.nih.gov/ncitbrowser/ConceptReport.jsp?dictionary=NCI_Thesaurus&code=C2884&ns=NCI_Thesaurus", 
      "donor_age": "NA", 
      "donor_age_unit": "year", 
      "donor_ethnicity": "NA", 
      "donor_health_status": "NA", 
      "donor_id": "McGill0488", 
      "donor_life_stage": "unknown", 
      "donor_sex": "Unknown", 
      "molecule": "genomic DNA", 
      "sample_ontology_uri": "http://purl.obolibrary.org/obo/CL_0000576", 
      "tissue_type": "venous blood", 
      "tissue_type_ontology_uri": "http://purl.obolibrary.org/obo/UBERON_0013756"
    }
  }
*/

const sampleColumns = [
    'biomaterial_type'
  , 'cell_type'
  , 'donor_id'
  , 'donor_age'
  , 'donor_age_unit'
  , 'donor_ethnicity'
  , 'sample_ontology_uri'
].map(s => ({ name: s }))

const sampleLenses = [
    lensPath(['biomaterial_type'])
  , lensPath(['cell_type'])
  , lensPath(['donor_id'])
  , lensPath(['donor_age'])
  , lensPath(['donor_age_unit'])
  , lensPath(['donor_ethnicity'])
  , lensPath(['sample_ontology_uri'])
]

const getSampleValue = (rowIndex, columnIndex, data) =>
  view(sampleLenses[columnIndex], data)


class App extends Component {
  constructor() {
    super()

    this.setDatasetValue = this.setDatasetValue.bind(this)
    this.setSampleValue = this.setSampleValue.bind(this)

    this.state = {
        datasets: datasets
      , samples: samples
    }
  }

  setDatasetValue(rowIndex, columnIndex, newValue) {
    const { datasets } = this.state

    const lens =
      compose(lensPath([rowIndex]), datasetLenses[columnIndex])

    this.setState({
      datasets: set(lens, newValue, datasets)
    })
  }

  setSampleValue(rowIndex, columnIndex, newValue) {
    const { samples } = this.state

    const lens =
      compose(lensPath([rowIndex]), sampleLenses[columnIndex])

    this.setState({
      samples: set(lens, newValue, samples)
    })
  }

  render() {
    const {
        datasets
      , samples
    } = this.state

    const datasetsTab = () => (
      <DataGrid
        key='datasets'
        rows={datasets}
        columns={datasetColumns}
        getCellValue={getDatasetValue}
        setCellValue={this.setDatasetValue}
      />
    )

    const samplesTab = () => (
      <DataGrid
        key='samples'
        rows={samples}
        columns={sampleColumns}
        getCellValue={getSampleValue}
        setCellValue={this.setSampleValue}
      />
    )

    const tabs = [
        { menuItem: 'Datasets', render: datasetsTab }
      , { menuItem: 'Samples',  render: samplesTab }
    ]

    return (
      <div className="App">
        <Container>
          <Header as='h1'>TempOne</Header>

          <Button>Hide complete rows</Button>

          <br/>
          <br/>

          <Tab panes={tabs} />

        </Container>
      </div>
    );
  }
}

export default App;
