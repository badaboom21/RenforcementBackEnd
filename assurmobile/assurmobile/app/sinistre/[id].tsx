import fetchData, { fetchDocument } from "@/hooks/fetchData";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  HelperText,
  List,
  Menu,
  Switch,
  Text,
  TextInput,
} from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";

type SinistreType = {
  id: number | string;
  plate?: string;
  sinister_datetime?: any;
  context?: string;
  driver_firstname?: string;
  driver_lastname?: string;
  call_datetime?: any;
  driver_responsability: boolean;
};

export default function SinistreDetailScreen() {
  // implémenter un state local pour charger le sinistre localement
  const [sinistre, setSinistre] = useState<SinistreType>();
  // Store contenant le document temporaire avant envoi du formulaire
  const [pickedFile, setPickedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  // store pour le libellé du document
  const [documentLabel, setDocumentLabel] = useState("");
  const [documentType, setDocumentType] = useState("DIAGNOSTIC_REPORT");
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<
    Array<{
      id: number | string;
      label?: string | null;
      type: string;
      path: string;
      validated?: boolean;
    }>
  >([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  // gestion de mes erreurs
  const [error, setError] = useState<string | null>(null);
  console.log("SinistreDetailScreen : ", sinistre);

  // récupérer le paramètre d'URL
  const { id } = useLocalSearchParams<{ id: string }>();

  // fonction de chargement d'un fichier
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      multiple: false,
    });
    if (result.canceled) {
      return;
    }
    // TODO : revoir la structure du result
    setPickedFile(result.assets[0]);
  };

  // Soumission du formulaire :
  const submitForm = () => {
    const formData = new FormData();
    formData.append("label", documentLabel);
    formData.append("type", documentType);
    if (pickedFile) {
      if (Platform.OS === "web") {
        // cas de la version web
        const webfile = (
          pickedFile as DocumentPicker.DocumentPickerAsset & { file?: File }
        ).file;
        if (webfile) formData.append("file", webfile);
      } else {
        // toutes les autres plateformes
        formData.append("file", {
          uri: pickedFile.uri,
          name: pickedFile.name,
          type: pickedFile.mimeType || "application/octet-stream",
        } as unknown as Blob);
      }
      setError(null);
      fetchDocument("/sinisters/" + id + "/documents", "POST", formData, true)
        .then((response) => {
          console.log(response);
          setSuccessMessage("Document transmis avec succès.");
          setError(null);
          // Recharger la liste des documents
          loadDocuments();
          // Masquer le message après 3 secondes
          setTimeout(() => setSuccessMessage(null), 3000);
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
          setSuccessMessage(null);
        });
    } else {
      setError("Pas de fichier sélectionné");
    }
  };

  // fonction de chargement des documents
  const loadDocuments = () => {
    if (!id) return;
    setDocumentsLoading(true);
    fetchData("/sinisters/" + id + "/documents", "GET", {}, true)
      .then((data) => {
        setDocuments(data.documents || []);
      })
      .catch((err) => {
        console.log("Error on get sinister documents " + err.message);
      })
      .finally(() => setDocumentsLoading(false));
  };

  // fetch récupérer le sinistre courant
  useEffect(() => {
    fetchData("/sinisters/" + id, "GET", {}, true)
      .then((data) => {
        setSinistre(data.sinister);
        console.log("DATA LOADED ", data);
      })
      .catch((err) => {
        console.log("Error on get sinistre " + err.message);
      });
  }, [id]);

  useEffect(() => {
    loadDocuments();
  }, [id]);

  console.log("SinistreDetailScreen apres fetch : ", sinistre);

  if (!sinistre) {
    return (
      <View>
        <Text>Le sinistre est introuvable !</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <Card key={sinistre.id}>
        <Card.Title title="Mon sinistre" />
        <Card.Content>
          <Text>Plaque : {sinistre.plate}</Text>
          <Text>Date du sinistre : {sinistre.sinister_datetime}</Text>
          <Text>
            Date de signalement du sinistre : {sinistre.call_datetime}
          </Text>
          <Text>Nom du conducteur : {sinistre.driver_lastname}</Text>
          <Text>Prénom du conducteur : {sinistre.driver_firstname}</Text>
          <Text>Contexte du sinistre : {sinistre.context}</Text>
          <Text>Responsabilité conducteur : </Text>
          <Switch disabled value={sinistre.driver_responsability} />
        </Card.Content>
      </Card>

      <Card>
        <Card.Content>
          <Text variant="titleMedium">Envoyer un document :</Text>
          <TextInput
            label="Libellé du document"
            onChangeText={setDocumentLabel}
          />
          <Menu
            visible={typeMenuVisible}
            onDismiss={() => setTypeMenuVisible(false)}
            anchor={
              <Button mode="outlined" onPress={() => setTypeMenuVisible(true)}>
                Type : {documentType}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setDocumentType("CNI_DRIVER");
                setTypeMenuVisible(false);
              }}
              title="CNI conducteur"
            />
            <Menu.Item
              onPress={() => {
                setDocumentType("VEHICLE_REGISTRATION_CERTIFICATE");
                setTypeMenuVisible(false);
              }}
              title="Certificat d'immatriculation"
            />
            <Menu.Item
              onPress={() => {
                setDocumentType("INSURANCE_CERTIFICATE");
                setTypeMenuVisible(false);
              }}
              title="Certificat d'assurance"
            />
            <Menu.Item
              onPress={() => {
                setDocumentType("DIAGNOSTIC_REPORT");
                setTypeMenuVisible(false);
              }}
              title="Rapport de diagnostic"
            />
            <Menu.Item
              onPress={() => {
                setDocumentType("CONTRACTOR_INVOICE");
                setTypeMenuVisible(false);
              }}
              title="Facture d'entrepreneur"
            />
            <Menu.Item
              onPress={() => {
                setDocumentType("INSURED_RIB");
                setTypeMenuVisible(false);
              }}
              title="RIB de l'assuré"
            />
          </Menu>
          <Button mode="outlined" onPress={pickDocument}>
            Fichier : ...
          </Button>
          <HelperText type="error" visible={Boolean(error)}>
            {error}
          </HelperText>
          <Button onPress={submitForm}>Envoyer le document</Button>
          <HelperText type="info" visible={Boolean(successMessage)}>
            {successMessage}
          </HelperText>
        </Card.Content>
      </Card>

      <Card>
        <Card.Title title="Documents liés" />
        <Card.Content>
          {documentsLoading ? (
            <Text>Chargement des documents...</Text>
          ) : documents.length === 0 ? (
            <Text>Aucun document lié à ce sinistre.</Text>
          ) : (
            <List.Section>
              {documents.map((document) => (
                <List.Item
                  key={document.id}
                  title={document.label || document.type}
                  description={document.path}
                  right={() =>
                    document.validated !== undefined ? (
                      <Text>
                        {document.validated ? "Validé" : "En attente"}
                      </Text>
                    ) : null
                  }
                />
              ))}
            </List.Section>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
