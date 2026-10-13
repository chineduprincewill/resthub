import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

const IndividualResultTable = ({ data, onExportPDF }) => {
  const [processedDrugData, setProcessedDrugData] = useState([]);
  const [sequencingData, setSequencingData] = useState([]);

  useEffect(() => {
    if (data) {
      processDrugData();
      processSequencingData();
    }
  }, [data]);

  const parseDrugResults = (resultString) => {
    try {
      const parsed = JSON.parse(resultString);
      if (!Array.isArray(parsed)) return [];
      
      return parsed.map((item) => ({
        drugName: item[0],
        result: item[1],
        date: item[2]
      }));
    } catch (error) {
      console.error('Error parsing drug results:', error);
      return [];
    }
  };

  const processDrugData = () => {
    // Parse all drug result types
    const pdstDrugs = parseDrugResults(data.pdstresult);
    const gdstLpaDrugs = parseDrugResults(data.gdstlparesult);
    const gdstXpertDrugs = parseDrugResults(data.gdstxpertresult);

    // Create a map to combine all unique drugs from all sources
    const drugMap = new Map();

    // Process pDST results
    pdstDrugs.forEach(drug => {
      if (!drugMap.has(drug.drugName)) {
        drugMap.set(drug.drugName, {
          drugName: drug.drugName,
          pdst: drug.result,
          gdstLpa: '',
          gdstXpert: ''
        });
      } else {
        const existing = drugMap.get(drug.drugName);
        existing.pdst = drug.result;
        drugMap.set(drug.drugName, existing);
      }
    });

    // Process gDST LPA results
    gdstLpaDrugs.forEach(drug => {
      if (!drugMap.has(drug.drugName)) {
        drugMap.set(drug.drugName, {
          drugName: drug.drugName,
          pdst: '',
          gdstLpa: drug.result,
          gdstXpert: ''
        });
      } else {
        const existing = drugMap.get(drug.drugName);
        existing.gdstLpa = drug.result;
        drugMap.set(drug.drugName, existing);
      }
    });

    // Process gDST Xpert results
    gdstXpertDrugs.forEach(drug => {
      if (!drugMap.has(drug.drugName)) {
        drugMap.set(drug.drugName, {
          drugName: drug.drugName,
          pdst: '',
          gdstLpa: '',
          gdstXpert: drug.result
        });
      } else {
        const existing = drugMap.get(drug.drugName);
        existing.gdstXpert = drug.result;
        drugMap.set(drug.drugName, existing);
      }
    });

    // Convert map to array and sort by drug name
    const sortedDrugs = Array.from(drugMap.values()).sort((a, b) => 
      a.drugName.localeCompare(b.drugName)
    );

    setProcessedDrugData(sortedDrugs);
  };

  const processSequencingData = () => {
    if (!data.sequenceBasedDrPredictionValues || data.sequenceBasedDrPredictionValues.length === 0) {
      setSequencingData([]);
      return;
    }

    // Group sequencing data by drug
    const drugGroups = new Map();
    
    data.sequenceBasedDrPredictionValues.forEach(item => {
      if (item.forms_text === "Drug") {
        // Start a new drug group
        const drugName = item.data_value;
        if (!drugGroups.has(drugName)) {
          drugGroups.set(drugName, {
            drug: drugName,
            gene: '',
            codonChange: '',
            aminoAcidChange: '',
            confidence: '',
            resistantLevel: '',
            comments: '',
            speciesBestMatch: '',
            sit: '',
            clade: '',
            snpLineageId: ''
          });
        }
      } else if (item.forms_text === "Gene") {
        // Find the most recent drug group or create one
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.gene = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Codon Change") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.codonChange = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Amino Acid Change") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.aminoAcidChange = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Confidence") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.confidence = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Resistant Level") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.resistantLevel = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Comments") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.comments = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Species Best Match") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.speciesBestMatch = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "SIT (Spoligotype)") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.sit = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "Clade") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.clade = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      } else if (item.forms_text === "SNP-Based Lineage ID") {
        const lastDrug = Array.from(drugGroups.keys()).pop();
        if (lastDrug && drugGroups.has(lastDrug)) {
          const group = drugGroups.get(lastDrug);
          group.snpLineageId = item.data_value;
          drugGroups.set(lastDrug, group);
        }
      }
    });

    // Convert map to array
    const sequencingArray = Array.from(drugGroups.values());
    setSequencingData(sequencingArray);
  };

  console.log(sequencingData);

  if (!data) return null;

  return (
    <div id="individual_01" className="overflow-auto">
      <div className="rounded-md border">
        <Table className="border-collapse">
          <TableBody>
            {/* Patient Information Section */}
            <TableRow className="font-bold bg-muted/30">
              <TableCell className="font-semibold" colSpan={3}>Participant ID</TableCell>
              <TableCell colSpan={5}>
                <span id="individualResultParticipantId">{data.participant_id}</span>
              </TableCell>
              <TableCell colSpan={3}>
                <Button 
                  onClick={onExportPDF} 
                  variant="outline" 
                  size="sm"
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  PDF
                </Button>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Sample ID</TableCell>
              <TableCell colSpan={9}>
                <span id="individualResultSampleId">{data.sample_id}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Age</TableCell>
              <TableCell colSpan={9}>
                <span id="IndividualResultAge">{data.age}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Sex</TableCell>
              <TableCell colSpan={9}>
                <span id="IndividualResultSex">{data.sex}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>HIV Status</TableCell>
              <TableCell colSpan={9}>
                <span id="IndividualResultHivStatus">{data.hiv_status}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Type of Patient</TableCell>
              <TableCell colSpan={9} id="typeOfPatient">
                <span id="IndividualResultTypeOfPatient">{data.typeofpatient}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Indication for DR TB Testing</TableCell>
              <TableCell colSpan={9} id="indicationForDrTbTesting">
                <span id="IndividualResultIndicationForDrTbTesting">{data.indicationfordrtbtesting}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Sample Collection Date</TableCell>
              <TableCell colSpan={9}>
                <span id="IndividualResultSampleCollectionDate">{data.samplecollectiondate}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>Sample Collection Laboratory</TableCell>
              <TableCell colSpan={9} id="sampleCollectionLaboratory">
                <span id="IndividualResultSampleCollectionLaboratory">{data.samplecollectionlab}</span>
              </TableCell>
            </TableRow>

            <TableRow className="font-bold">
              <TableCell className="font-semibold" colSpan={2}>DR Category:</TableCell>
              <TableCell colSpan={9}>
                <span id="IndividualResultDrCategory">{data.drcategory}</span>
              </TableCell>
            </TableRow>

            {/* Drug Resistance Table Header */}
            <TableRow className="bg-muted/50">
              <TableHead rowSpan={2} className="font-bold text-center align-middle border">Drug</TableHead>
              <TableHead rowSpan={2} className="font-bold text-center align-middle border">pDST</TableHead>
              <TableHead colSpan={2} className="font-bold text-center border">gDST</TableHead>
              <TableHead rowSpan={2} className="font-bold text-center align-middle border">Specie</TableHead>
            </TableRow>

            <TableRow className="bg-muted/50">
              <TableHead className="font-bold text-center border">LPA</TableHead>
              <TableHead className="font-bold text-center border">Xpert</TableHead>
            </TableRow>

            {/* Dynamic Drug Data Rows */}
            {processedDrugData.length > 0 ? (
              processedDrugData.map((drug) => (
                <TableRow key={drug.drugName}>
                  <TableCell className="font-bold border">{drug.drugName}</TableCell>
                  <TableCell className="border">
                    <span className={`font-medium ${
                      drug.pdst === 'R' ? 'text-red-600' : 
                      drug.pdst === 'S' ? 'text-green-600' : ''
                    }`}>
                      {drug.pdst || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="border">
                    <span className={`font-medium ${
                      drug.gdstLpa === 'R' ? 'text-red-600' : 
                      drug.gdstLpa === 'S' ? 'text-green-600' : ''
                    }`}>
                      {drug.gdstLpa || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="border">
                    <span className={`font-medium ${
                      drug.gdstXpert === 'R' ? 'text-red-600' : 
                      drug.gdstXpert === 'S' ? 'text-green-600' : ''
                    }`}>
                      {drug.gdstXpert || '-'}
                    </span>
                  </TableCell>
                  <TableCell className="border">MTB</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No drug resistance data available
                </TableCell>
              </TableRow>
            )}

            {/* Sequencing-based DR Prediction Section */}
            {sequencingData.length > 0 && (
              <>
                <TableRow className="bg-primary/10">
                  <TableCell colSpan={5} className="font-bold text-lg py-4">
                    Sequencing-based DR Prediction Results
                  </TableCell>
                </TableRow>

                {/* Sequencing Table Header */}
                <TableRow className="bg-muted/50">
                  <TableHead className="font-bold text-center border">Drug</TableHead>
                  <TableHead className="font-bold text-center border">Gene</TableHead>
                  <TableHead className="font-bold text-center border">Codon Change</TableHead>
                  <TableHead className="font-bold text-center border">Amino Acid Change</TableHead>
                  <TableHead className="font-bold text-center border">Resistant Level</TableHead>
                </TableRow>

                {/* Sequencing Data Rows */}
                {sequencingData.map((seq, index) => (
                  <TableRow key={index}>
                    <TableCell className="border font-medium">{seq.drug}</TableCell>
                    <TableCell className="border">{seq.gene || '-'}</TableCell>
                    <TableCell className="border">{seq.codonChange || '-'}</TableCell>
                    <TableCell className="border">{seq.aminoAcidChange || '-'}</TableCell>
                    <TableCell className="border">
                      <span className={`font-semibold ${
                        seq.resistantLevel === 'Resistant' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {seq.resistantLevel || '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Additional Sequencing Details */}
                {sequencingData[0] && (sequencingData[0].speciesBestMatch || sequencingData[0].snpLineageId) && (
                  <>
                    <TableRow className="bg-muted/30">
                      <TableCell colSpan={5} className="font-semibold py-2">
                        Additional Sequencing Information
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-semibold border">Species Best Match</TableCell>
                      <TableCell colSpan={4} className="border">
                        {sequencingData[0].speciesBestMatch || '-'}
                      </TableCell>
                    </TableRow>
                    {sequencingData[0].snpLineageId && (
                      <TableRow>
                        <TableCell className="font-semibold border">SNP-Based Lineage ID</TableCell>
                        <TableCell colSpan={4} className="border">
                          {sequencingData[0].snpLineageId}
                        </TableCell>
                      </TableRow>
                    )}
                    {sequencingData[0].sit && sequencingData[0].sit !== 'n/a' && (
                      <TableRow>
                        <TableCell className="font-semibold border">SIT (Spoligotype)</TableCell>
                        <TableCell colSpan={4} className="border">
                          {sequencingData[0].sit}
                        </TableCell>
                      </TableRow>
                    )}
                    {sequencingData[0].clade && sequencingData[0].clade !== 'n/a' && (
                      <TableRow>
                        <TableCell className="font-semibold border">Clade</TableCell>
                        <TableCell colSpan={4} className="border">
                          {sequencingData[0].clade}
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IndividualResultTable;