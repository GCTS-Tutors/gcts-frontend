import { Typography, Container, Box, Card, CardContent, Grid, Chip } from '@mui/material';
import { Article, DateRange, Person } from '@mui/icons-material';

// Sample data - will be replaced with API data later
const samplePapers = [
  {
    id: 1,
    title: "Advanced Machine Learning Techniques",
    author: "Dr. John Smith",
    date: "2024-01-15",
    subject: "Computer Science",
    abstract: "This paper explores cutting-edge machine learning algorithms and their applications in modern AI systems.",
  },
  {
    id: 2,
    title: "Environmental Impact of Renewable Energy",
    author: "Prof. Sarah Johnson",
    date: "2024-01-10",
    subject: "Environmental Science",
    abstract: "A comprehensive analysis of renewable energy sources and their environmental benefits and challenges.",
  },
  {
    id: 3,
    title: "Modern Economic Theory Applications",
    author: "Dr. Michael Brown",
    date: "2024-01-05",
    subject: "Economics",
    abstract: "Examining contemporary economic theories and their practical applications in global markets.",
  },
];

export default function PapersPage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 4,
            textAlign: 'center',
          }}
        >
          Academic Papers
        </Typography>
        
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            mb: 6,
            textAlign: 'center',
            maxWidth: '600px',
            mx: 'auto',
          }}
        >
          Browse our collection of high-quality academic papers and research materials
        </Typography>

        <Grid container spacing={4}>
          {samplePapers.map((paper) => (
            <Grid item xs={12} md={6} lg={4} key={paper.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Article sx={{ color: 'primary.main', mr: 1 }} />
                    <Chip
                      label={paper.subject}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                  
                  <Typography
                    variant="h6"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.3,
                      mb: 2,
                    }}
                  >
                    {paper.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {paper.author}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DateRange sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(paper.date).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {paper.abstract}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {samplePapers.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Article sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No papers available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check back later for new academic papers and research materials.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}