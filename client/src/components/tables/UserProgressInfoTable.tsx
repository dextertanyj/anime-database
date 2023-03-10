import {
  Button,
  createStyles,
  Grid,
  LinearProgress,
  makeStyles,
  Paper,
  Theme,
  Typography,
  withStyles,
} from '@material-ui/core';
import { blueGrey } from '@material-ui/core/colors';
import UpdateOutlinedIcon from '@material-ui/icons/UpdateOutlined';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useMySeriesProgressQuery } from '../../gql/queries';
import { ActionType } from '../../utils/constants';
import { renderWatchStatus } from '../../utils/enumRender';
import { isNumberOrElse } from '../../utils/form';
import { UserProgressForm } from '../dialogs/UserProgressForm';
import { UserProgressInfoTableSkeleton } from '../skeletons/UserProgressInfoTableSkeleton';

type Props = {
  seriesId: string;
};

const BorderLinearProgress = withStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 15,
      borderRadius: 15,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 15,
    },
  })
)(LinearProgress);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(3),
      textAlign: 'center',
    },
    tableHeader: {
      marginBottom: '10px',
    },
    tableTitle: {
      color: blueGrey[700],
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    tableContent: {
      '& div': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      },
    },
    listItem: {
      marginTop: '10px',
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  })
);

export const UserProgressInfoTable = (props: Props) => {
  const classes = useStyles();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [formActionType, setFormActionType] = useState<ActionType>(
    ActionType.CREATE
  );
  const [innerWidth, setInnerWidth] = useState<number>(window.innerWidth);

  const { data: progress, refetch, loading } = useMySeriesProgressQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      where: {
        id: props.seriesId,
      },
    },
  });

  useEffect(() => {
    const handleResize = () => {
      setInnerWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      {loading && !progress?.mySeriesProgress ? (
        <UserProgressInfoTableSkeleton />
      ) : (
        <Paper elevation={3} className={classes.paper}>
          <Grid container spacing={3} className={classes.tableHeader}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm className={classes.tableTitle}>
                  <Typography variant="h5">Watch Progress</Typography>
                </Grid>
                {!progress?.mySeriesProgress ? (
                  <Grid item xs={12} sm={'auto'}>
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      startIcon={<UpdateOutlinedIcon />}
                      onClick={() => {
                        setFormActionType(ActionType.CREATE);
                        setShowForm(true);
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={'auto'}>
                    <Button
                      fullWidth
                      color="primary"
                      variant="contained"
                      startIcon={<UpdateOutlinedIcon />}
                      onClick={() => {
                        setFormActionType(ActionType.UPDATE);
                        setShowForm(true);
                      }}
                    >
                      Update
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {!progress?.mySeriesProgress ? (
              <Grid item xs={12}>
                <Typography variant="overline" style={{ fontSize: '1em' }}>
                  No existing watch progress record found
                </Typography>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Grid container spacing={3} className={classes.tableContent}>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Watch Status</Typography>
                  </Grid>
                  <Grid item xs={8} md={10} lg={2}>
                    <Typography>
                      {progress?.mySeriesProgress?.status &&
                        renderWatchStatus(progress?.mySeriesProgress?.status)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Episodes</Typography>
                  </Grid>
                  <Grid item xs={8} md={10} lg={2}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.completed,
                        '??????'
                      )}`}{' '}
                      /{' '}
                      {progress?.mySeriesProgress?.series?.episodeCount || '??????'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Last Updated</Typography>
                  </Grid>
                  <Grid item xs={8} md={10} lg={2}>
                    <Typography>
                      {moment(
                        progress?.mySeriesProgress?.updatedAt ||
                          progress?.mySeriesProgress?.createdAt
                      ).format('HH:mm DD/MM/YYYY')}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Overall</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={9}>
                    {progress?.mySeriesProgress?.overall ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.overall}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.overall,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Story</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={3}>
                    {progress?.mySeriesProgress?.story ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.story}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.story,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Execution</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={3}>
                    {progress?.mySeriesProgress?.execution ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.execution}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.execution,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Appeal</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={3}>
                    {progress?.mySeriesProgress?.appeal ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.appeal}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.appeal,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Character</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={3}>
                    {progress?.mySeriesProgress?.character ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.character}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.character,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Art</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={3}>
                    {progress?.mySeriesProgress?.art ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.art}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.art,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2} lg={2}>
                    <Typography>Music</Typography>
                  </Grid>
                  <Grid item xs={6} md={8} lg={3}>
                    {progress?.mySeriesProgress?.sound ? (
                      <BorderLinearProgress
                        variant="determinate"
                        value={progress?.mySeriesProgress?.sound}
                      />
                    ) : (
                      <BorderLinearProgress variant="determinate" value={0} />
                    )}
                  </Grid>
                  <Grid item xs={2} md={2} lg={1}>
                    <Typography>
                      {`${isNumberOrElse(
                        progress?.mySeriesProgress?.sound,
                        '??????'
                      )}${innerWidth >= 960 ? ' / 100' : ''}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} md={2}>
                    <Typography>Comments</Typography>
                  </Grid>
                  <Grid item xs={8} md={10}>
                    <Typography>
                      {progress?.mySeriesProgress?.remarks || '???'}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
      {showForm && (
        <UserProgressForm
          open={showForm}
          action={formActionType}
          seriesId={props.seriesId}
          progressId={
            formActionType === ActionType.UPDATE
              ? progress?.mySeriesProgress?.id ?? undefined
              : undefined
          }
          onSubmit={() => refetch()}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
