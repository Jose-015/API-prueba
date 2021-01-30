package wbio.app.mappaton;

import androidx.appcompat.app.AppCompatActivity;

import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.os.FileUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.UUID;

public class AdministrarRutas extends AppCompatActivity {


    Archivo myFile;

    int serverResponseCode = 0;
    ProgressDialog mydialog;

    String upLoadServerUri = null;
    ListView lv_mylist;

    /****  File Path *****/
    String uploadFilePath;
    String uploadFileName;

    ArrayList<String> items;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_administrar_rutas);

        mydialog = null;
        myFile = new Archivo();
        uploadFilePath = AdministrarRutas.this.getFilesDir().toString()+"/rutas/";
        items = new ArrayList<String>();

        //myFile.writeToFile(uploadFilePath,"r0.txt","contenido de prueba\n");

        lv_mylist = findViewById(R.id.lv_lista);

        /***** Php script path ******/
        upLoadServerUri = " https://dd99c1fadb7f.ngrok.io/Mappaton/upload.php";
        //upLoadServerUri = "https://209915ab1f3b.ngrok.io/subirImagen/";
        uploadFileName = "";

        ListFiles(uploadFilePath);

        //-----------EVENTOS------------------------


        lv_mylist.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView <?> parent, View view, int position, long id) {

                ConfirmarEnvio("¿Seguro quiere enviar el archivo: "+ items.get(position) +" ?", "Enviar", "Cancelar");
                uploadFileName = items.get(position);

            }
        });
    }//END OF ONCREATE

    public void ConfirmarEnvio(String mensaje, String positivo, String negativo)
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(AdministrarRutas.this);
        builder.setMessage(mensaje);

        builder.setPositiveButton(positivo, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                //do things

                mydialog = ProgressDialog.show(AdministrarRutas.this, "", "Enviando Archivo...", true);
                //uploadFile(uploadFilePath + uploadFileName);
                new Thread(new Runnable() {
                    public void run() {
                        runOnUiThread(new Runnable() {
                            public void run() {
                                //messageText.setText("uploading started.....");
                                //messageText.setText(myFile.readFile(MainActivity.this.getFilesDir().toString(), "MiArchivo"));
                            }
                        });

                        uploadFile(uploadFilePath+uploadFileName);

                    }
                }).start();


            }
        });

        builder.setNegativeButton(negativo, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                //do things
            }
        });

        /*builder.setNeutralButton("CANCEL", new DialogInterface.OnClickListener()     {
            public void onClick(DialogInterface dialog, int id) {
                //do things
            }
        });*/
        AlertDialog alert = builder.create();
        alert.show();
    }// en of ConfirmarEnvio


    public void ConfirmarUpload(String mensaje, String positivo)
    {
        AlertDialog.Builder builder = new AlertDialog.Builder(AdministrarRutas.this);
        builder.setMessage(mensaje);

        builder.setPositiveButton(positivo, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                //do things


            }
        });

        AlertDialog alert = builder.create();
        alert.show();
    }// en of ConfirmarEnvio


    public void uploadFile(String sourceFileUri) {
        HttpURLConnection mHttpURLConnection = null;
        DataOutputStream mOutputStream = null;
        String strLineEnd = "\r\n";
        String strTwoHyphens = "--";
        String strUpLoadServerUri = upLoadServerUri;
        String strBoundary = "***";
        int bytesRead, bytesAvailable, bufferSize;
        byte[] buffer;
        int maxBufferSize = 1 * 1024 * 1024;
        File sourceFile = new File(sourceFileUri);

        if (!sourceFile.isFile()) {

            mydialog.dismiss();

            Log.e("uploadFile", "Source File not exist :" + sourceFile.getAbsolutePath());

            runOnUiThread(new Runnable() {
                public void run() {
                    //messageText.setText("Source File not exist :"+uploadFilePath + "" + uploadFileName);
                }
            });

        }
        else
        {

            try {

                // open a URL connection to the Servlet
                FileInputStream fileInputStream = new FileInputStream(sourceFile);
                URL url = new URL(strUpLoadServerUri);

                // Open a HTTP connection to the URL

                mHttpURLConnection = (HttpURLConnection) url.openConnection();
                mHttpURLConnection.setDoInput(true); // Allow Inputs
                mHttpURLConnection.setDoOutput(true); // Allow Outputs
                mHttpURLConnection.setUseCaches(false); // Don't use a Cached Copy

                mHttpURLConnection.setRequestMethod("POST");
                mHttpURLConnection.setRequestProperty("Connection","Keep-Alive");
                mHttpURLConnection.setRequestProperty("ENCTYPE","multipart/form-data");
                mHttpURLConnection.setRequestProperty("Content-Type","multipart/form-data;boundary=" + strBoundary);
                mHttpURLConnection.setRequestProperty("uploaded_file",sourceFileUri);
                //mHttpURLConnection.setRequestProperty("foto",sourceFileUri);

                //mHttpURLConnection.setRequestProperty("Opcion","1");

                mOutputStream = new DataOutputStream(mHttpURLConnection.getOutputStream());

                mOutputStream.writeBytes(strTwoHyphens + strBoundary + strLineEnd);
                mOutputStream.writeBytes("Content-Disposition: form-data; name=\"uploaded_file\";filename="+ sourceFileUri + strLineEnd);
                //mOutputStream.writeBytes("Content-Disposition: form-data; name=\"foto\";filename="+ sourceFileUri + strLineEnd);
               // mOutputStream.writeBytes("Content-Disposition: form-data; name=\"Opcion\";" + strLineEnd);

                mOutputStream.writeBytes(strLineEnd);

                // create a buffer of maximum size
                bytesAvailable = fileInputStream.available();

                bufferSize = Math.min(bytesAvailable, maxBufferSize);
                buffer = new byte[bufferSize];

                // read file and write it into form...
                bytesRead = fileInputStream.read(buffer, 0, bufferSize);

                while (bytesRead > 0) {

                    mOutputStream.write(buffer, 0, bufferSize);
                    bytesAvailable = fileInputStream.available();
                    bufferSize = Math.min(bytesAvailable, maxBufferSize);
                    bytesRead = fileInputStream.read(buffer, 0, bufferSize);

                }

                // send multipart form data necesssary after file data...
                mOutputStream.writeBytes(strLineEnd);
                mOutputStream.writeBytes(strTwoHyphens + strBoundary + strTwoHyphens + strLineEnd);

                // Responses from the server (code and message)
                serverResponseCode = mHttpURLConnection.getResponseCode();

                // close the streams //
                fileInputStream.close();
                mOutputStream.flush();
                mOutputStream.close();

            } catch (MalformedURLException ex) {
                ex.printStackTrace();
                Log.e("Upload file to server", "error: " + ex.getMessage(),ex);
            } catch (Exception e) {
                e.printStackTrace();
                Log.e("Exception","Exception : " + e.getMessage(), e);
            }
        }

        if (serverResponseCode == 200) {

            Log.d("File Uploaded For ",sourceFileUri + "   Successful");

            mydialog.dismiss();

            runOnUiThread(new Runnable() {
                public void run() {

                        /*
                        String msg = "File Upload Completed.\n\n See uploaded file here : \n\n"
                                +" http://www.androidexample.com/media/uploads/"
                                +uploadFileName;

                        //messageText.setText(msg);
                        */

                    Toast.makeText(AdministrarRutas.this, "Archivo enviado exitosamente",
                            Toast.LENGTH_SHORT).show();



                }
            });

        }
        else{
            Log.d("File Uploaded For ",sourceFileUri + "   Failed");
            mydialog.dismiss();

            runOnUiThread(new Runnable() {
                public void run() {

                        /*
                        String msg = "File Upload Completed.\n\n See uploaded file here : \n\n"
                                +" http://www.androidexample.com/media/uploads/"
                                +uploadFileName;

                        //messageText.setText(msg);
                        */

                    Toast.makeText(AdministrarRutas.this, "File Upload Failed.",
                            Toast.LENGTH_SHORT).show();

                    //ConfirmarUpload("Archivo enviado exitosamente", "Aceptar");
                }
            });
        }
    }// end of uploadFile


    public void ListFiles(String path)
    {
        File directory = new File(path);
        if(directory.exists()){

            File[] fList = directory.listFiles();


            for (File file : fList) {
                items.add(file.getName());
            }

            ArrayAdapter adaptador = new ArrayAdapter(this, android.R.layout.simple_list_item_1, items);
            lv_mylist.setAdapter(adaptador);

        }
        else {//directorio no existe
            Toast.makeText(AdministrarRutas.this, "No hay rutas guardadas", Toast.LENGTH_SHORT).show();
        }
    }//End of ListFiles


}