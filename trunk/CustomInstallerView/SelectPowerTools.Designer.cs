namespace CustomInstallerView
{
    partial class SelectPowerTools
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.btnNext = new System.Windows.Forms.Button();
            this.lineBottom = new System.Windows.Forms.GroupBox();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.label1 = new System.Windows.Forms.Label();
            this.btnSelectGeneral = new System.Windows.Forms.Button();
            this.btnSelectSystem = new System.Windows.Forms.Button();
            this.btnSelectDevelopers = new System.Windows.Forms.Button();
            this.panelGeneral = new System.Windows.Forms.Panel();
            this.panelSystem = new System.Windows.Forms.Panel();
            this.panelDevelopers = new System.Windows.Forms.Panel();
            this.btnCancel = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            this.SuspendLayout();
            // 
            // btnNext
            // 
            this.btnNext.Location = new System.Drawing.Point(395, 349);
            this.btnNext.Name = "btnNext";
            this.btnNext.Size = new System.Drawing.Size(97, 23);
            this.btnNext.TabIndex = 3;
            this.btnNext.Text = "&Next";
            this.btnNext.UseVisualStyleBackColor = true;
            this.btnNext.Click += new System.EventHandler(this.btnNext_Click);
            // 
            // lineBottom
            // 
            this.lineBottom.Location = new System.Drawing.Point(-2, 341);
            this.lineBottom.Name = "lineBottom";
            this.lineBottom.Size = new System.Drawing.Size(501, 2);
            this.lineBottom.TabIndex = 6;
            this.lineBottom.TabStop = false;
            // 
            // pictureBox1
            // 
            this.pictureBox1.Image = global::CustomInstallerView.Properties.Resources.topImageForInstaller;
            this.pictureBox1.Location = new System.Drawing.Point(-2, -1);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(501, 72);
            this.pictureBox1.TabIndex = 7;
            this.pictureBox1.TabStop = false;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.BackColor = System.Drawing.SystemColors.Window;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 11F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(12, 9);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(363, 36);
            this.label1.TabIndex = 8;
            this.label1.Text = "Select the PowerTools you want to activate on \r\nthis Content Management Server";
            // 
            // btnSelectGeneral
            // 
            this.btnSelectGeneral.Location = new System.Drawing.Point(32, 77);
            this.btnSelectGeneral.Name = "btnSelectGeneral";
            this.btnSelectGeneral.Size = new System.Drawing.Size(99, 23);
            this.btnSelectGeneral.TabIndex = 9;
            this.btnSelectGeneral.Text = "General";
            this.btnSelectGeneral.UseVisualStyleBackColor = true;
            this.btnSelectGeneral.Click += new System.EventHandler(this.btnSelectGeneral_Click);
            // 
            // btnSelectSystem
            // 
            this.btnSelectSystem.Location = new System.Drawing.Point(187, 77);
            this.btnSelectSystem.Name = "btnSelectSystem";
            this.btnSelectSystem.Size = new System.Drawing.Size(99, 23);
            this.btnSelectSystem.TabIndex = 10;
            this.btnSelectSystem.Text = "System";
            this.btnSelectSystem.UseVisualStyleBackColor = true;
            this.btnSelectSystem.Click += new System.EventHandler(this.btnSelectSystem_Click);
            // 
            // btnSelectDevelopers
            // 
            this.btnSelectDevelopers.Location = new System.Drawing.Point(361, 77);
            this.btnSelectDevelopers.Name = "btnSelectDevelopers";
            this.btnSelectDevelopers.Size = new System.Drawing.Size(99, 23);
            this.btnSelectDevelopers.TabIndex = 11;
            this.btnSelectDevelopers.Text = "Developers";
            this.btnSelectDevelopers.UseVisualStyleBackColor = true;
            this.btnSelectDevelopers.Click += new System.EventHandler(this.btnSelectDevelopers_Click);
            // 
            // panelGeneral
            // 
            this.panelGeneral.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panelGeneral.Location = new System.Drawing.Point(1, 103);
            this.panelGeneral.Name = "panelGeneral";
            this.panelGeneral.Size = new System.Drawing.Size(163, 236);
            this.panelGeneral.TabIndex = 12;
            // 
            // panelSystem
            // 
            this.panelSystem.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panelSystem.Location = new System.Drawing.Point(168, 103);
            this.panelSystem.Name = "panelSystem";
            this.panelSystem.Size = new System.Drawing.Size(160, 236);
            this.panelSystem.TabIndex = 13;
            // 
            // panelDevelopers
            // 
            this.panelDevelopers.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.panelDevelopers.Location = new System.Drawing.Point(332, 103);
            this.panelDevelopers.Name = "panelDevelopers";
            this.panelDevelopers.Size = new System.Drawing.Size(160, 236);
            this.panelDevelopers.TabIndex = 13;
            // 
            // btnCancel
            // 
            this.btnCancel.Location = new System.Drawing.Point(292, 349);
            this.btnCancel.Name = "btnCancel";
            this.btnCancel.Size = new System.Drawing.Size(97, 23);
            this.btnCancel.TabIndex = 14;
            this.btnCancel.Text = "&Cancel";
            this.btnCancel.UseVisualStyleBackColor = true;
            this.btnCancel.Visible = false;
            this.btnCancel.Click += new System.EventHandler(this.btnCancel_Click);
            // 
            // SelectPowerTools
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(495, 380);
            this.ControlBox = false;
            this.Controls.Add(this.btnCancel);
            this.Controls.Add(this.panelDevelopers);
            this.Controls.Add(this.panelSystem);
            this.Controls.Add(this.panelGeneral);
            this.Controls.Add(this.btnSelectDevelopers);
            this.Controls.Add(this.btnSelectSystem);
            this.Controls.Add(this.btnSelectGeneral);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.lineBottom);
            this.Controls.Add(this.btnNext);
            this.MaximizeBox = false;
            this.Name = "SelectPowerTools";
            this.ShowInTaskbar = false;
            this.SizeGripStyle = System.Windows.Forms.SizeGripStyle.Hide;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Select PowerTools features";
            this.Load += new System.EventHandler(this.SelectPowerTools_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button btnNext;
        private System.Windows.Forms.GroupBox lineBottom;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Button btnSelectGeneral;
        private System.Windows.Forms.Button btnSelectSystem;
        private System.Windows.Forms.Button btnSelectDevelopers;
        private System.Windows.Forms.Panel panelGeneral;
        private System.Windows.Forms.Panel panelSystem;
        private System.Windows.Forms.Panel panelDevelopers;
        private System.Windows.Forms.Button btnCancel;
    }
}

