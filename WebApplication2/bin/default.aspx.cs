using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Services;
using System.Data;
using System.Web.Script.Services;
using Oracle.ManagedDataAccess.Client;
using log4net;
using System.Configuration;

namespace WebApplication2
{
    
    public partial  class  Builder : System.Web.UI.Page
    {
        // read from web config file
        private const string CONNECTION_STRING_FILE = "piworks-db";
        private  string connectionString  = ConfigurationManager.ConnectionStrings[CONNECTION_STRING_FILE].ConnectionString;
        
        
        OracleConnection conn;
        OracleTransaction translation;
        private static readonly ILog Log = log4net.LogManager.GetLogger("MyAppender");

    

        protected void Page_Load(object sender, EventArgs e)
        {
            
            //DBString.readFile(CONNECTION_STRING);

        }
        
        
        #region  WEBMETHODS
       
        [WebMethod]
        public static void DeleteTodoList(int[] id)
        {
#pragma warning disable CS0436 // Type conflicts with imported type
           Builder todo = new Builder();
#pragma warning disable CS0436 // Type conflicts with imported type
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.setConnection();
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.openConnection();
            for (int i = 0; i < id.Length; i++)
            {
                todo.Delete(id[i]);
            }
            todo.closeConnection();
          
        }


        [WebMethod]
        public static void DeleteTodo(int id)
        {
#pragma warning disable CS0436 // Type conflicts with imported type
            Builder todo = new Builder();
#pragma warning disable CS0436 // Type conflicts with imported type
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.setConnection();
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.openConnection();
            todo.Delete(id);
            todo.closeConnection();
        }

        [WebMethod]
        public static void insertTodo(Todo[] myTodo)
        {

#pragma warning disable CS0436 // Type conflicts with imported type
            Builder todo = new Builder();
#pragma warning disable CS0436 // Type conflicts with imported type
#pragma warning restore CS0436 // Type conflicts with imported type
            
            string truncateQuery = "truncate table all_todos";
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.executeQuery(truncateQuery);
            
            try
            {
                todo.setConnection();
                todo.openConnection();
                foreach (Todo td in myTodo)
                    todo.insert(td);
                   
                todo.closeConnection();
               

            }

            catch (Exception ex)
            {
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
            }

        }

        [WebMethod]
       
        public static List<Todo> getTodos()
        {
            Log.Info("get To DO data");
           
#pragma warning disable CS0436 // Type conflicts with imported type
            Builder todo = new Builder();
#pragma warning disable CS0436 // Type conflicts with imported type
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.setConnection();
#pragma warning restore CS0436 // Type conflicts with imported type
            todo.openConnection();
            List<Todo> todos =  todo.getTodo();
            todo.closeConnection();
            return todos;
            
        }

        [WebMethod]
        [ScriptMethod(UseHttpGet = true)]
        public static void updatePriority(int id,string priority)
        {
#pragma warning disable CS0436 // Type conflicts with imported type
            Builder builder = new Builder();
#pragma warning disable CS0436 // Type conflicts with imported type
#pragma warning restore CS0436 // Type conflicts with imported type
            builder.update(id,priority);
#pragma warning restore CS0436 // Type conflicts with imported type
           
        }

        #endregion


        #region DATABASE METHOD
        private void update(int id, string priority)
        {
            string updateQuery = "update all_todos set priority = '" + priority + "' where id = " + id;
            executeQuery(updateQuery);    
        }
        private void executeQuery(string query)
        {
            setConnection();
            openConnection();
            
            OracleCommand cmdInsert = new OracleCommand(query, conn);
            try
            {
                translation = conn.BeginTransaction(IsolationLevel.ReadCommitted);
                cmdInsert.Transaction = translation;

                Log.Info("Execution query : " + query);
                cmdInsert.ExecuteNonQuery();
                translation.Commit();               
               

            }

            catch (Exception ex)
            {
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
                translation.Rollback();
                Log.Info("Data has been rollbacked");

            }

            finally
            {
                cmdInsert.Dispose();
                translation.Dispose();
                closeConnection();
            }

        }

        private List<Todo> getTodo()
        {
            Log.Info("get Todo function started");
            List<Todo> todos = new List<Todo>();
          
            string query = "select * from  all_todos";
            

            Log.Info("Query : " + query);
            DataTable dataTable = new DataTable();
            OracleDataReader reader;
            OracleCommand cmd;
            try
            {
                
                cmd = new OracleCommand(query, conn);
                reader = cmd.ExecuteReader();
                Log.Info("ordered successfully");
                while (reader.Read())
                {
                    Todo data = new Todo(reader.GetInt16(0), reader.GetInt16(1), reader.GetString(2), reader.GetString(3), reader.GetString(4));
                    todos.Add(data);
                }
                Log.Info("ordered data[0].title : " + todos.ElementAt(0).title);
                cmd.Dispose();
                
            }

            catch (Exception ex)
            {
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
            }


            return todos;
        }

        private void Delete(int id)
        {
           
            string deleteQuery = "delete from all_todos where id = :ID";
            OracleCommand cmdInsert = new OracleCommand(deleteQuery, conn);
            try
            {
                translation = conn.BeginTransaction(IsolationLevel.ReadCommitted);
                cmdInsert.Transaction = translation;
                
                cmdInsert.Parameters.Add(new OracleParameter("id", OracleDbType.Int16)).Value = id;
               
                Log.Info("Deletion query : " + deleteQuery);
                cmdInsert.ExecuteNonQuery();
                translation.Commit();
                //Log.Info("Data has been added and commited");
                Log.Info("Deleted");

            }

            catch (Exception ex)
            {
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
                translation.Rollback();
                Log.Info("Data has been rollbacked");

            }

            finally
            {
                cmdInsert.Dispose();
                translation.Dispose();
            }



        }

        private void insert(Todo todo)
        {
            // also usable for values (?,?,?,?) and according to addition with the Parameters.Add() , each parameter adds
            string insertQuery = "insert into all_todos (userid,id,title,completed,priority)";
            insertQuery += " values (:userid,:id,:title,:completed,:priority)";
            OracleCommand cmdInsert = new OracleCommand(insertQuery,conn);
           
            try
            {
                translation = conn.BeginTransaction(IsolationLevel.ReadCommitted);
                cmdInsert.Transaction = translation;

                cmdInsert.Parameters.Add(new OracleParameter("userid", OracleDbType.Int16)).Value = todo.userID;
                cmdInsert.Parameters.Add(new OracleParameter("id", OracleDbType.Int16)).Value = todo.ID;
                cmdInsert.Parameters.Add(new OracleParameter("title", OracleDbType.Varchar2)).Value = todo.title;
                cmdInsert.Parameters.Add(new OracleParameter("completed", OracleDbType.Varchar2)).Value = todo.completed;
                cmdInsert.Parameters.Add(new OracleParameter("completed", OracleDbType.Varchar2)).Value = "None";
                            
                cmdInsert.ExecuteNonQuery();
                translation.Commit();
                Log.Info("Data has been added and commited");
               

            }

            catch (Exception ex)
            {
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
                translation.Rollback();
                Log.Info("Data has been rollbacked");

            }

            finally
            {
                cmdInsert.Dispose();
                translation.Dispose();
            }



        }

        #endregion DATABASE METHOD

        #region CONNECTION CONFIG
        public void setConnection()
        {
            //connectionString = String.Format("Data Source={0};User ID={1};Password={2}", host + ":" + port + "/" + service, user, pass);
            conn = new OracleConnection(connectionString);
        }

        private  void openConnection()
        {
            try
            {
                if (conn.State != ConnectionState.Open)
                {
                    Log.Info("connection is starting...\n");
                    conn.Open();
                    Log.Info("Connected\n");
                }
            }
            catch (Exception ex)
            {
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
                //Console.WriteLine(ex.StackTrace);
               
            }
        }

        private   void closeConnection()
        {
            try
            {
                if (conn.State == ConnectionState.Open)
                {
                    Log.Info("connection is closing...\n");
                    conn.Close();
                    Log.Info("Closed\n");
                }
            }
            catch (Exception ex)
            {
                //Console.WriteLine(ex.StackTrace);
                Log.Error(ex.Message);
                Log.Error(ex.StackTrace);
                
            }
        }

        #endregion CONNECTION CONFIG
    }


}

