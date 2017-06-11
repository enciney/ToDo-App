using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace WebApplication2
{
    public class Todo
    {
        public int userID { get; set; }
        public int ID { get; set; }
        public string title { get; set; }
        public string completed { get; set; }

        public string priority { get; set; }

        public Todo(int userId, int id, string title, string completed)
        {
            this.userID = userId;
            this.ID = id;
            this.title = title;
            this.completed = completed;
        }

        public Todo(int userId, int id, string title, string completed,string priority)
        {
            this.userID = userId;
            this.ID = id;
            this.title = title;
            this.completed = completed;
            this.priority = priority;
        }

        public Todo() { }

    }
}